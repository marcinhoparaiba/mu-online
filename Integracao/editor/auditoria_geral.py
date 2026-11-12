# Varredura geral do MU BanneD: monstros, spawns, lojas, baus de evento, mapas/portoes, asas, imagens Lua, banco e logs.
import re, sys, collections, subprocess
from pathlib import Path
sys.path.insert(0, 'work'); from mu_merge_common import *
P = collections.defaultdict(list)
dec = lambda p: bytes(v ^ lua_key[i % len(lua_key)] ^ ((i - 0x56) & 255) for i, v in enumerate(p.read_bytes()[52:])).decode('cp1252', 'replace')
def linhas(p):
    for l in Path(p).read_text('cp1252', 'replace').splitlines():
        s = l.split('//')[0].strip()
        if s and s.lower() != 'end': yield s
for sala in ('SalaTrade', 'SalaUpar', 'SalaVip'):
    D = server / f'Salas/{sala}/Data'
    if not D.exists(): continue
    itens = set(read_catalog(D / 'Item/Item.txt'))
    mons = {int(s.split()[0]) for s in linhas(D / 'Monster/Monster.txt') if re.match(r'\d+\s', s)}
    # spawns -> monstro existe
    for f in (D / 'Monster/MonsterSpawn').glob('*.txt'):
        for s in linhas(f):
            v = s.split()
            if len(v) >= 2 and v[0].isdigit() and v[1].isdigit() and int(v[0]) in range(0, 1) and False: pass
            m = re.match(r'(\d+)\s+(\d+)\s+(\d+)', s)
            if m and len(v) > 4 and int(m[1]) not in mons and int(m[1]) < 1000 and f.name[0].isdigit():
                P[f'{sala}: spawn de monstro inexistente'].append(f'{f.name}: {s[:40]}')
    # lojas e baus -> item existe
    for f in list((D / 'Shop').glob('*.txt')) + list((D / 'EventItemBag').glob('*.txt')):
        for s in linhas(f):
            m = re.match(r'(\d+)\s+(\d+)\s+\d+', s)
            if m and 'Shop' in str(f.parent) and (int(m[1]), int(m[2])) not in itens:
                P[f'{sala}: loja com item inexistente'].append(f'{f.name}: {m[1]}:{m[2]}')
    # asas custom -> item existe
    cw = D / 'Custom/CustomWing.txt'
    if cw.exists():
        for s in linhas(cw):
            v = s.split()
            if len(v) > 2 and v[1].isdigit():
                g, i = divmod(int(v[1]), 512)
                if (g, i) not in itens: P[f'{sala}: CustomWing aponta item inexistente'].append(f'{g}:{i}')
    # portoes -> mapa existe no cliente
    mapas = {int(s.split()[0]) for s in linhas(D / 'MapManager.txt') if s.split()[0].isdigit()}
    for s in linhas(D / 'Move/Gate.txt'):
        v = s.split()
        if len(v) > 2 and v[0].isdigit() and v[2].isdigit() and int(v[2]) not in mapas:
            P[f'{sala}: portao para mapa fora do MapManager'].append(s[:40])
    # log de hoje
    lg = sorted((server / f'Salas/{sala}/GameServer/LOGS/LOG_GAMESERVER').glob('*.txt'))
    if lg:
        for l in lg[-1].read_text('latin1', 'replace').splitlines()[-2000:]:
            if re.search(r'lua.*(error|erro)|attempt to|nil value|stack traceback|failed to load|nao encontrad', l, re.I): P[f'{sala}: erro no log'].append(l[:110])
cl = client / 'Data'
# (mapas: Blood Castle, Chaos Castle, Kalima etc. dividem a mesma pasta World; nao da para checar por numero)
# cliente: imagens carregadas pelo Lua existem
for f in (cl / 'Configs/Lua').rglob('*.lua'):
    for img in re.findall(r'LoadImage(?:ByDir)?\(\s*"([^"]+)"', dec(f)):
        rel = img.replace('///', '/').replace('\\\\', '/').replace('\\', '/')
        alts = [rel] + [rel.rsplit('.', 1)[0] + e for e in ('.ozt', '.ozj', '.OZT', '.OZJ')]
        if not any((cl / a).exists() or (cl / 'Interface' / a).exists() for a in alts): P['cliente: imagem Lua faltando'].append(f'{f.name}: {img}')
# banco: itens invalidos em inventarios e baus
cat = set(read_catalog(server / 'Salas/SalaTrade/Data/Item/Item.txt'))
def sql(q): return subprocess.run(['sqlcmd', '-S', r'.\MUBANNEDTEST', '-E', '-C', '-d', 'MuBanneD52Integrado', '-y', '0', '-Q', 'SET NOCOUNT ON;' + q], capture_output=True, text=True).stdout
for tab, chave, col in (('Character', 'Name', 'Inventory'), ('warehouse', 'AccountID', 'Items')):
    for l in sql(f"SELECT {chave} + '|' + CONVERT(varchar(max),{col},2) FROM {tab}").split():
        if '|' not in l: continue
        nome, hx = l.split('|', 1)
        try: b = bytes.fromhex(hx)
        except ValueError: continue
        for s in range(len(b) // 16):
            r = b[s * 16:s * 16 + 16]
            if r[0] == 0xFF and r[9] >> 4 == 0xF: continue
            k = (r[9] >> 4, r[0] | ((r[7] & 0x80) << 1))
            if k not in cat: P[f'banco: item inexistente em {tab}'].append(f'{nome} slot {s} item {k}')
for c, v in P.items(): print(f'== {c}: {len(v)}'); print('\n'.join('   ' + x for x in v[:8]))
print('FIM', sum(map(len, P.values())), 'achados')
