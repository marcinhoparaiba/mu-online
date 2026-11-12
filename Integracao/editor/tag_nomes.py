# Coloca [EXCLUSIVO] (eventos) e [LIMITADO] (donate) no nome dos itens: Item.txt das 3 salas + nomes do cliente.
# Item que deixou de ser exclusivo volta ao nome original (backup em work/antes-tags).
import re, sys, struct, shutil
sys.path.insert(0, 'work'); from mu_merge_common import *
srv = (server / 'Salas/SalaTrade/Data/Scripts/Commands/EditorItens.lua').read_text('cp1252')
ex = {int(a): int(b) for a, b in re.findall(r'\[(\d+)\]=([12])', srv.split('EDITOR_EXCL = {')[1].split('}')[0])}
TAG = {1: '[EXCLUSIVO]', 2: '[LIMITADO]'}; LIM = 30
MARCA = re.compile(r'\s*\[(EXCLUSIVO|LIMITADO)\]')
def novo(nome, v):
    base = MARCA.sub('', nome).strip(); tg = TAG[v]
    return base[:LIM - len(tg) - 1].rstrip() + ' ' + tg
bk = work / 'antes-tags'; bk.mkdir(exist_ok=True)
ORIG = {}; sec = None
if (bk / 'Item.SalaTrade.txt').exists():
    for l in (bk / 'Item.SalaTrade.txt').read_text('cp1252').splitlines():
        s = l.strip()
        if re.fullmatch(r'\d+', s): sec = int(s); continue
        m = re.match(r'(\d+)\s+(?:-?\d+|\*)\s+\d+\s+\d+\s+\d+\s+\d+\s+\d+\s+\d+\s+"([^"]*)"', s)
        if m and sec is not None: ORIG[(sec, int(m[1]))] = m[2]
for r in ('SalaTrade', 'SalaUpar', 'SalaVip'):
    p = server / f'Salas/{r}/Data/Item/Item.txt'
    if not (bk / f'Item.{r}.txt').exists(): shutil.copy2(p, bk / f'Item.{r}.txt')
    L = p.read_text('cp1252').split('\n'); sec = None; n = 0
    for k, l in enumerate(L):
        s = l.strip()
        if re.fullmatch(r'\d+', s): sec = int(s); continue
        m = re.match(r'(\s*(\d+)\s+(?:-?\d+|\*)\s+\d+\s+\d+\s+\d+\s+\d+\s+\d+\s+\d+\s+")([^"]*)(".*)$', l)
        if m and sec is not None and not s.startswith('//'):
            key = (sec, int(m[2])); v = ex.get(sec * 512 + key[1])
            if v: L[k] = m[1] + novo(m[3], v) + m[4]; n += 1
            elif MARCA.search(m[3]): L[k] = m[1] + ORIG.get(key, MARCA.sub('', m[3]).strip()) + m[4]; n += 1
    p.write_text('\n'.join(L), 'cp1252'); print(r, n)
for loc in locations:
    p = client / 'Data/Local' / loc
    if not (bk / loc.replace('/', '_')).exists(): shutil.copy2(p, bk / loc.replace('/', '_'))
    t = read_bmd(p)
    for g in range(16):
        for i in range(512):
            nm = item_name(t, g, i)
            if not nm: continue
            v = ex.get(g * 512 + i); o = offset(g, i)
            if v: t[o:o + 30] = novo(nm, v).encode('cp1252').ljust(30, b'\0')
            elif MARCA.search(nm): t[o:o + 30] = ORIG.get((g, i), MARCA.sub('', nm).strip()).encode('cp1252')[:29].ljust(30, b'\0')
    e = xor(bytes(t), item_key); p.write_bytes(e + struct.pack('<I', checksum(e)))
print('cliente ok')
