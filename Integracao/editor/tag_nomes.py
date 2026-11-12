# Coloca [EXCLUSIVO] (eventos) e [LIMITADO] (donate) no nome dos itens: Item.txt das 3 salas + nomes do cliente.
import re, sys, struct, shutil
sys.path.insert(0, 'work'); from mu_merge_common import *
srv = (server / 'Salas/SalaTrade/Data/Scripts/Commands/EditorItens.lua').read_text('cp1252')
ex = {int(a): int(b) for a, b in re.findall(r'\[(\d+)\]=([12])', srv.split('EDITOR_EXCL = {')[1].split('}')[0])}
TAG = {1: '[EXCLUSIVO]', 2: '[LIMITADO]'}; LIM = 30
def novo(nome, v):
    base = re.sub(r'\s*\[(EXCLUSIVO|LIMITADO)\]', '', nome).strip(); tg = TAG[v]
    return (base[:LIM - len(tg) - 1].rstrip() + ' ' + tg)
bk = work / 'antes-tags'; bk.mkdir(exist_ok=True)
for r in ('SalaTrade', 'SalaUpar', 'SalaVip'):
    p = server / f'Salas/{r}/Data/Item/Item.txt'
    if not (bk / f'Item.{r}.txt').exists(): shutil.copy2(p, bk / f'Item.{r}.txt')
    L = p.read_text('cp1252').split('\n'); sec = None; n = 0
    for k, l in enumerate(L):
        s = l.strip()
        if re.fullmatch(r'\d+', s): sec = int(s); continue
        m = re.match(r'(\s*(\d+)\s+(?:-?\d+|\*)\s+\d+\s+\d+\s+\d+\s+\d+\s+\d+\s+\d+\s+")([^"]*)(".*)$', l)
        if m and sec is not None and not s.startswith('//'):
            v = ex.get(sec * 512 + int(m[2]))
            if v: L[k] = m[1] + novo(m[3], v) + m[4]; n += 1
    p.write_text('\n'.join(L), 'cp1252'); print(r, n)
for loc in locations:
    p = client / 'Data/Local' / loc
    if not (bk / loc.replace('/', '_')).exists(): shutil.copy2(p, bk / loc.replace('/', '_'))
    t = read_bmd(p)
    for it, v in ex.items():
        g, i = divmod(it, 512); nm = item_name(t, g, i)
        if nm: o = offset(g, i); t[o:o + 30] = novo(nm, v).encode('cp1252').ljust(30, b'\0')
    e = xor(bytes(t), item_key); p.write_bytes(e + struct.pack('<I', checksum(e)))
print('cliente ok')
