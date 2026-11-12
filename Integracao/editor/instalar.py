# Gera o EditorItens.lua do cliente (com a lista de itens), cifra e instala; copia o comando /editor para as 3 salas.
import sys, shutil
from pathlib import Path
A = Path(__file__).resolve().parent; R = A.parents[1]; W = R.parents[1] / 'work'
sys.path.insert(0, str(A.parent / 'loja')); sys.path.insert(0, str(A)); import loja
import math
nome = lambda s, i: loja.ITENS[(s, i)]['n'].replace(chr(92), '').replace('"', "'")
import re
# --- nota de cada item: forca (dano/defesa e nivel exigido, relativo a categoria) + efeitos visuais originais ---
key0 = (W / 'lua-codec-key.bin').read_bytes()
dec = lambda b: bytes(v ^ key0[i % len(key0)] ^ ((i - 0x56) & 255) for i, v in enumerate(b[52:])).decode('cp1252', 'replace')
LUA = R / '2 - Cliente/Data/Configs/Lua'
achar = lambda txt: {(int(s), int(i)) for s, i in re.findall(r'GET_ITEM(?:_MODEL)?\(\s*(\d+)\s*,\s*(\d+)\s*\)', txt)}
efeito = achar(dec((W / 'antes-brilho-asas/CharacterEffectItens.lua').read_bytes()))   # sem o brilho automatico
# (CustomMeshGlow fica de fora: e o brilho de +nivel dos sets classicos)
seteff = achar(dec((LUA / 'EffectSystem/CharacterSetEffect.lua').read_bytes()))
efeito |= seteff
drop = achar(dec((LUA / 'EffectSystem/ItemDropEffects.lua').read_bytes()))
forca, sec, head = {}, None, []
for l in loja.ITEM_TXT.read_text('latin1').splitlines():
    s = l.strip()
    if s.startswith('//Type'): head = s[2:].split(); continue
    if re.fullmatch(r'\d+', s): sec = int(s); continue
    m = re.match(r'(\d+)\s+(?:-?\d+|\*)\s+\d+\s+\d+\s+\d+\s+\d+\s+\d+\s+\d+\s+"[^"]+"\s*(.*)', s)
    if not m or sec is None: continue
    r = m[2].split(); v = lambda c: float(r[head.index(c) - 9]) if c in head and head.index(c) - 9 < len(r) and re.fullmatch(r'-?\d+', r[head.index(c) - 9]) else 0
    forca[(sec, int(m[1]))] = (max(v('DamageMax'), v('Defense'), v('MagicDamageRate')), v('ReqLevel') * 2 + v('ReqStrength') + v('ReqDexterity') + v('ReqEnergy'))
def pct(vals):
    o = sorted(set(vals)); return {x: (o.index(x) / max(len(o) - 1, 1)) for x in o}
nota = {}
for sc in range(16):
    ks = [k for k in loja.ITENS if k[0] == sc]
    p0 = pct([forca.get(k, (0, 0))[0] for k in ks]); p1 = pct([forca.get(k, (0, 0))[1] for k in ks])
    for k in ks:
        f = forca.get(k, (0, 0))
        nota[k] = p0[f[0]] * 0.4 + p1[f[1]] * 0.6 + (0.6 if k in efeito else 0) + (0.2 if k in drop else 0)
excl = set()
for sc in range(16):  # 30% de cada categoria com a maior nota ficam exclusivos
    ks = sorted((k for k in loja.ITENS if k[0] == sc), key=lambda k: (nota[k], k[1]), reverse=True)
    excl |= set(ks[:math.ceil(len(ks) * 0.3)])
sets = {}
for s, i in loja.ITENS:
    if 7 <= s <= 11: sets[i] = sets.get(i, 0) | (1 << (s - 7))
setids = sorted(i for i, m in sets.items() if bin(m).count('1') >= 3)
notaset = {i: sum(nota[(s, i)] for s in range(7, 12) if (s, i) in nota) / bin(sets[i]).count('1') for i in setids}
setexcl = set(sorted(setids, key=lambda i: (notaset[i], i), reverse=True)[:math.ceil(len(setids) * 0.3)])
(A / 'exclusivos.txt').write_text(chr(10).join(['ITENS EXCLUSIVOS (30% de cada categoria, maior nota: forca + efeitos)'] + ['%d:%d %s%s' % (s, i, loja.ITENS[(s, i)]['n'], ' [efeito]' if (s, i) in efeito else '') for s, i in sorted(excl)] + ['', 'SETS EXCLUSIVOS'] + ['%d %s' % (i, loja.ITENS.get((8, i), loja.ITENS.get((7, i)))['n'] if ((8, i) in loja.ITENS or (7, i) in loja.ITENS) else str(i)) for i in sorted(setexcl)]), encoding='utf-8')
print('com efeito:', len(efeito & set(loja.ITENS)), '| exclusivos com efeito:', len(excl & efeito))
import json
DJ = A / 'destaques.json'; DEST, DSET = set(), []
if DJ.exists():  # 10 destaques por categoria + 10 sets: sempre exclusivos e no topo da lista
    d = json.loads(DJ.read_text('utf-8')); DSET = d.pop('ALL'); excl = {tuple(x) for x in d.pop('EXCL', [])} or excl; setexcl = set(d.pop('SETEXCL', [])) or setexcl; DEST = {tuple(x) for v in d.values() for x in v}
    excl |= DEST; setexcl |= set(DSET)
# --- 20 LINHAS exclusivas (ALL completo do tema: armas, asa/capa, pet/anel/pendant, set) ---
import linhas as LN
DONATE = ['banned', 'zeus', 'horus', 'poseidon', 'god 2.0', 'holly', 'holly night', 'necromancer', 'armagedom', 'apocalipse 2.0', 'death 3.0', 'blood vampire', 'manticore', 'mystic', 'war 2.0', 'ice dragon', 'death', 'ghost', 'dark raven', 'light hawk']
EVENTOS = ['gold', 'diamond', 'snow black', 'frost black', 'steel 2.0', 'lord', 'halloween', 'gift christmas', 'abbadon', 'bright red',
           'black christmas', 'sonnar', 'cold', 'tail fox', 'snow', 'santa', 'dark pirate', 'frost', '01 x renew', 'steel']
ESCOLHA = DONATE + EVENTOS
LIN = {}
for n, tema_ in enumerate(ESCOLHA, 1):
    for k in LN.L[tema_]:
        if 'dinorant' not in loja.ITENS[k]['n'].lower(): LIN[k] = n  # Dinorant e basico: fica na loja comum
excl = set(LIN)
setlin = {}
for (s, i), n in LIN.items():
    if 7 <= s <= 11: setlin[i] = n
setexcl = set(setlin)
NOMES_LIN = [t.title().replace('Banned', 'BanneD').replace('Lord', 'LorD') for t in ESCOLHA]
linhas = ['{%d,%d,"%s",%d,L=%d}' % (s, i, nome(s, i), (s, i) in excl, LIN.get((s, i), 0)) for s, i in sorted(loja.ITENS, key=lambda k: ((k not in DEST), k))]
setids = sorted(setids, key=lambda i: (i not in DSET, i))
# premios automaticos (ranking PvP e mata-mata): o vencedor escolhe a CATEGORIA; o item sai sorteado dela (linhas de EVENTO)
PREMIO = []  # (categoria, item1, item2, item3)
for n, tema_ in enumerate(EVENTOS, len(DONATE) + 1):
    its = [k for k in LN.L[tema_] if LIN.get(k) == n]
    nm = lambda k: loja.ITENS[k]['n'].lower(); g = lambda k: k[0] * 512 + k[1]
    for k in its:
        cat = {0: 'sword', 1: 'machado', 3: 'lanca', 4: 'arco', 5: 'staff', 6: 'shield', 12: 'asa'}.get(k[0])
        if k[0] == 2: cat = 'scepter' if 'scepter' in nm(k) else 'mace'
        if k[0] == 13 and not any(w in nm(k) for w in ('ring', 'pendant')): cat = 'pet'
        if cat: PREMIO.append((cat, g(k), 0, 0))
    an = [k for k in its if k[0] == 13 and 'ring' in nm(k)]; pe = [k for k in its if k[0] == 13 and 'pendant' in nm(k)]
    if an and pe: PREMIO.append(('kit', g(pe[0]), g(an[0]), g(an[-1])))
for i in setids:
    ver = 8 if sets[i] & 2 else next(s for s in range(7, 12) if sets[i] & (1 << (s - 7)))
    linhas.append('{16,%d,"Set %s",%d,%d,%d,L=%d}' % (i, nome(ver, i), i in setexcl, sets[i], ver, setlin.get(i, 0)))
its = ',\n'.join(linhas)
src = (A / 'EditorItens.client.lua').read_text('utf-8').replace('--ITENS--', '\n' + its + '\n').replace('--LINHAS--', ','.join('"%s"' % x for x in NOMES_LIN)).replace('--NDON--', str(len(DONATE)))
key = (W / 'lua-codec-key.bin').read_bytes()
cod = lambda d: bytes(v ^ key[i % len(key)] ^ ((i - 0x56) & 255) for i, v in enumerate(d))
S = R / '2 - Cliente/Data/Configs/Lua/Manager/Customs/System'
head = (S / 'Move.lua').read_bytes()[:52]
(S / 'EditorItens.lua').write_bytes(head + cod(src.encode('cp1252', 'replace')))
assert cod((S / 'EditorItens.lua').read_bytes()[52:]).decode('cp1252') == src.encode('cp1252', 'replace').decode('cp1252')
for sala in ('SalaTrade', 'SalaUpar', 'SalaVip'):
    srv = (A / 'EditorItens.server.lua').read_text('utf-8').replace('--EXCL--', ','.join('[%d]=%d' % (s * 512 + i, 2 if LIN.get((s, i), 99) <= len(DONATE) else 1) for s, i in sorted(excl))).replace('--VALIDOS--', ','.join('[%d]=true' % (s * 512 + i) for s, i in loja.ITENS)).replace('--SETMASK--', ','.join('[%d]=%d' % (i, m) for i, m in sets.items())).replace('--PREMIO--', ','.join('{"%s",%d,%d,%d}' % x for x in PREMIO)).replace('--SETEXCL--', ','.join('[%d]=%d' % (i, 2 if setlin.get(i, 99) <= len(DONATE) else 1) for i in sorted(setexcl)))
    (R / f'1 - MuServer 97d+5.2 Aprendizmuonline/Salas/{sala}/Data/Scripts/Commands/EditorItens.lua').write_text(srv, encoding='cp1252')
print('premios:', len(PREMIO)); print('instalado:', len(loja.ITENS), 'itens,', len(excl), 'exclusivos,', len(setids), 'sets,', len(setexcl), 'sets exclusivos')
