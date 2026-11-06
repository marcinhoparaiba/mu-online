"""Read-only inventory of a local MU package. Never loads DLLs or executes files."""
import argparse
import hashlib
import json
import struct
from collections import Counter
from pathlib import Path
import xml.etree.ElementTree as ET


def pe_header(path):
    with path.open('rb') as stream:
        head = stream.read(64)
        if len(head) < 64 or head[:2] != b'MZ':
            return None
        offset = struct.unpack_from('<I', head, 60)[0]
        if offset < 64 or offset > path.stat().st_size - 24:
            return {'valid': False}
        stream.seek(offset)
        data = stream.read(24)
        if data[:4] != b'PE\0\0':
            return {'valid': False}
        machine, sections = struct.unpack_from('<HH', data, 4)
        return {'valid': True, 'machine': hex(machine), 'architecture':
                {0x14c: 'x86', 0x8664: 'x64'}.get(machine, 'unknown'), 'sections': sections}


def inventory(root, output):
    root = root.resolve(strict=True)
    if not root.is_dir():
        raise ValueError('Package root must be a directory')
    output = output.resolve()
    if output.is_relative_to(root):
        raise ValueError('Output must be outside the package')
    if output.exists():
        raise FileExistsError('Refusing to overwrite an existing inventory')
    rows = []
    skipped = []
    for path in sorted(root.rglob('*')):
        relative = path.relative_to(root).as_posix()
        if path.is_symlink() or not path.resolve().is_relative_to(root):
            skipped.append(relative)
            continue
        if not path.is_file():
            continue
        digest = hashlib.sha256()
        row = {'path': relative, 'bytes': path.stat().st_size}
        try:
            with path.open('rb') as stream:
                for block in iter(lambda: stream.read(1024 * 1024), b''):
                    digest.update(block)
            row['sha256'] = digest.hexdigest()
            if path.suffix.lower() in {'.exe', '.dll'}:
                row['pe'] = pe_header(path)
        except OSError as error:
            row['read_error'] = {'errno': error.errno, 'winerror': getattr(error, 'winerror', None)}
        if path.suffix.lower() == '.vcxproj':
            try:
                tree = ET.parse(path)
                values = lambda tag: sorted({e.text.strip() for e in tree.iter()
                    if e.tag.rsplit('}', 1)[-1] == tag and e.text and e.text.strip()})
                row['project'] = {tag: values(tag) for tag in
                    ['PlatformToolset', 'WindowsTargetPlatformVersion', 'ConfigurationType']}
                row['project']['build_commands'] = len(values('Command'))
            except ET.ParseError:
                row['project'] = {'parse_error': True}
        rows.append(row)
    result = {'files': len(rows), 'bytes': sum(r['bytes'] for r in rows),
              'extensions': dict(Counter(Path(r['path']).suffix.lower() for r in rows)),
              'skipped_links': skipped, 'unreadable_files': sum('read_error' in r for r in rows), 'entries': rows}
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open('x', encoding='utf-8') as stream:
        json.dump(result, stream, ensure_ascii=True, indent=2)
    return result


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    result = inventory(args.root, args.output)
    print(json.dumps({'files': result['files'], 'bytes': result['bytes'],
                      'skipped_links': len(result['skipped_links'])}))
