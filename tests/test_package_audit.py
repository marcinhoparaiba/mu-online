import importlib.util
import struct
import tempfile
import unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location('audit',Path(__file__).resolve().parents[1]/'scripts/audit-game-package.py')
audit=importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)
class AuditTests(unittest.TestCase):
 def test_pe_reads_header_without_executing(self):
  with tempfile.TemporaryDirectory() as d:
   p=Path(d)/'fixture.exe';data=bytearray(88);data[:2]=b'MZ';struct.pack_into('<I',data,60,64);data[64:68]=b'PE\0\0';struct.pack_into('<HH',data,68,0x14c,3);p.write_bytes(data)
   self.assertEqual(audit.pe_header(p)['architecture'],'x86')
   struct.pack_into('<I',data,60,0xffffffff);p.write_bytes(data);self.assertFalse(audit.pe_header(p)['valid'])
 def test_preserves_files_and_excludes_content(self):
  with tempfile.TemporaryDirectory() as d:
   root=Path(d)/'package';root.mkdir();p=root/'private.ini';data=b'password=synthetic-only';p.write_bytes(data);out=Path(d)/'manifest.json';result=audit.inventory(root,out)
   self.assertEqual(result['files'],1);self.assertEqual(p.read_bytes(),data);self.assertNotIn('synthetic-only',out.read_text())
   with self.assertRaises(FileExistsError):audit.inventory(root,out)
 def test_refuses_output_inside_package(self):
  with tempfile.TemporaryDirectory() as d:
   with self.assertRaises(ValueError):audit.inventory(Path(d),Path(d)/'manifest.json')
if __name__=='__main__':unittest.main()
