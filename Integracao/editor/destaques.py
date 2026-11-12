# Escolhe 10 destaques por categoria (+10 sets ALL): primeiro itens MuAway (texturas *away*), depois com efeito, depois maior nota.
# Grava destaques.json (o instalar.py usa) e da efeito aos destaques que nao tem. Backup em work/antes-destaques.
import re, sys, json, shutil, io
from pathlib import Path
import numpy as np
from PIL import Image
__file__ = str(Path(__file__).resolve().parent / 'instalar.py')
exec(open(__file__, encoding='utf-8').read().split('linhas = ')[0])
sys.path.insert(0, str(A.parent / 'bmd')); import bmd
I = R / '2 - Cliente/Data/Item'; F = {p.stem.lower(): p for p in list((R / '2 - Cliente/Data/Player').glob('*.bmd')) + list(I.glob('*.bmd'))}
NL = chr(13) + chr(10)
modelo = {}
for txt in (dec((LUA / 'Configs/LoadItens.lua').read_bytes()), dec((LUA / 'Configs/CustomWings.lua').read_bytes())):
    for s, i, nm in re.findall(r"GET_ITEM(?:_MODEL)?\(\s*(\d+)\s*,\s*(\d+)\s*\)[^'\"]*?['\"](\w+)['\"]\)", txt): modelo[(int(s), int(i))] = nm.lower()
efeito_atual = achar(dec((LUA / 'EffectSystem/CharacterEffectItens.lua').read_bytes())) | seteff

def away(k):
    f = F.get(modelo.get(k, ''))
    if not f: return False
    try: return any('away' in m['texname'].lower() for m in bmd.read(f)['meshes'])
    except Exception: return False

AW = {k for k in loja.ITENS if away(k)}

# --- beleza: cor viva (saturacao), cor diferente das outras da categoria, detalhe (vertices, textura) e ser custom ---
import colorsys, math as M
def visual(k):
    f = F.get(modelo.get(k, ''))
    if not f: return None
    try: m = bmd.read(f)
    except Exception: return None
    nv = sum(len(me['v']) for me in m['meshes']); px = 0; cols = []
    for me in m['meshes']:
        s = me['texname'].rsplit('.', 1)[0].lower()
        for e, sk in (('.ozj', 24), ('.ozt', 4)):
            q = f.parent / (s + e)
            if q.exists():
                try:
                    im = Image.open(io.BytesIO(q.read_bytes()[sk:])).convert('RGBA'); px += im.width * im.height
                    a_ = np.asarray(im.resize((32, 32))).reshape(-1, 4).astype(float); a_ = a_[a_[:, 3] > 40][:, :3] / 255
                    cols += [colorsys.rgb_to_hsv(*c) for c in a_[::4]]
                except Exception: pass
                break
    if not cols: return None
    h = np.array(cols); sat = float((h[:, 1] * h[:, 2]).mean())
    hue = (float(np.angle(np.exp(2j * np.pi * h[:, 0]).dot(h[:, 1]))) / (2 * np.pi)) % 1
    return dict(nv=nv, px=px, sat=sat, hue=hue)
VIS = {k: visual(k) for k in loja.ITENS}
CLASSICO = {0: 35, 1: 10, 2: 20, 3: 12, 4: 30, 5: 40, 6: 25, 7: 60, 8: 60, 9: 60, 10: 60, 11: 60, 12: 50, 13: 100, 14: 200, 15: 50}
bel = {}
for sc in range(16):
    ks = [k for k in loja.ITENS if k[0] == sc]
    vs = [VIS[k] for k in ks if VIS[k]]
    rk = lambda key: pct([v[key] for v in vs])
    psat, pnv, ppx = rk('sat'), rk('nv'), rk('px')
    hues = [v['hue'] for v in vs]
    for k in ks:
        v = VIS[k]; custom = 1.0 if k[1] >= CLASSICO[sc] or re.search(r'\[|2\.0|BanneD|Abbadon|Gold|Diamond', loja.ITENS[k]['n']) else 0.0
        if not v: bel[k] = custom * 0.2 + nota[k] * 0.2 + (0.25 if k in efeito_atual else 0)
        else:
            raro = sum(min(abs(v['hue'] - x), 1 - abs(v['hue'] - x)) for x in hues) / max(len(hues), 1) * 2  # 0..1: quanto a cor foge das outras
            bel[k] = 0.30 * psat[v['sat']] + 0.20 * raro + 0.15 * pnv[v['nv']] + 0.10 * ppx[v['px']] + 0.15 * custom + 0.10 * min(nota[k], 1) + (0.25 if k in efeito_atual else 0)
        if sc in (13, 14) and not custom: bel[k] *= 0.4  # pets/caixas: prioriza os custom
        if sc == 13:
            nm = loja.ITENS[k]['n']
            if re.search(r'Pet|Fenrir|Horse|Dinorant|Griffin|Hawk|Raven|Dragon|Spirit|Fox|Uniria|Eagle|BanneD|Angel', nm, re.I): bel[k] += 0.4
            elif re.search(r'Scroll|Aura|Seal|Talisman|Charm|Ticket|Ward|Contract|Invitation', nm, re.I): bel[k] *= 0.3
excl = set()
for sc in range(16):
    ks = sorted((k for k in loja.ITENS if k[0] == sc), key=lambda k: (bel[k], k[1]), reverse=True)
    excl |= set(ks[:math.ceil(len(ks) * 0.3)])
notaset = {i: sum(bel[(s, i)] for s in range(7, 12) if (s, i) in bel) / bin(sets[i]).count('1') for i in setids}
setexcl = set(sorted(setids, key=lambda i: notaset[i], reverse=True)[:math.ceil(len(setids) * 0.3)])
dest = {}
for sc in range(16):
    ks = sorted((k for k in loja.ITENS if k[0] == sc), key=lambda k: (k in AW, bel[k]), reverse=True)
    dest[sc] = ks[:10]
awset = {i for i in setids if any((s, i) in AW for s in range(7, 12))}
dest['ALL'] = sorted(setids, key=lambda i: (i in awset, notaset[i]), reverse=True)[:10]
(A / 'destaques.json').write_text(json.dumps(dict({str(k): ([list(x) for x in v] if k != 'ALL' else v) for k, v in dest.items()}, EXCL=[list(x) for x in sorted(excl)], SETEXCL=sorted(setexcl))), encoding='utf-8')

def cor(f):
    for me in bmd.read(f)['meshes']:
        s = me['texname'].rsplit('.', 1)[0].lower()
        for e, sk in (('.ozj', 24), ('.ozt', 4)):
            q = f.parent / (s + e)
            if q.exists():
                try:
                    a = np.asarray(Image.open(io.BytesIO(q.read_bytes()[sk:])).convert('RGBA')).reshape(-1, 4).astype(float); a = a[a[:, 3] > 40][:, :3]
                    if len(a): c = a.mean(0) / 255; return tuple(float(x) for x in np.round(np.clip(c / max(c.max(), .01), .15, 1), 2))
                except Exception: pass
    return (1.0, .75, .2)

enc = lambda txt: bytes(v ^ key0[i % len(key0)] ^ ((i - 0x56) & 255) for i, v in enumerate(txt.encode('cp1252')))
bk = W / 'antes-destaques'; bk.mkdir(exist_ok=True)

# efeito nos destaques (armas, escudos, asas, pets) que ainda nao tem
fi = LUA / 'EffectSystem/CharacterEffectItens.lua'
if not (bk / fi.name).exists(): shutil.copy2(fi, bk / fi.name)
raw = fi.read_bytes(); txt = dec(raw); add = ''; n1 = 0
for sc in (0, 1, 2, 3, 4, 5, 6, 12, 13):
    for k in dest[sc]:
        f = F.get(modelo.get(k, ''))
        if k in efeito_atual or not f or f'GET_ITEM_MODEL({k[0]}, {k[1]})' in txt: continue
        bones = [j for j, b in enumerate(bmd.read(f)['bones']) if b][:20]
        if not bones: continue
        r, g, b = cor(f)
        linhas = [f"{{ Type = 0, EffectID = 32002, EffectLv = 0, Bone = {j}, Size = 1.40, ColorR = {r}, ColorG = {g}, ColorB = {b}, Black = 0, RandTime = 100 }}," for j in bones]
        add += NL + f"--destaque {loja.ITENS[k]['n']}" + NL + f"CUSTOM_EFFECT_INFOS[GET_ITEM_MODEL({k[0]}, {k[1]})] = {{" + NL + NL.join(linhas) + NL + "}" + NL
        n1 += 1
fi.write_bytes(raw[:52] + enc(txt + add))

# efeito de set (pela bota) nos 10 sets ALL que nao tem
fs = LUA / 'EffectSystem/CharacterSetEffect.lua'
if not (bk / fs.name).exists(): shutil.copy2(fs, bk / fs.name)
raw = fs.read_bytes(); txt = dec(raw); add = ''; n2 = 0
for i in dest['ALL']:
    if f'GET_ITEM_MODEL(11, {i})' in txt or (11, i) not in loja.ITENS: continue
    f = F.get(modelo.get((8, i), '')); r, g, b = cor(f) if f else (1.0, .75, .2)
    linhas = [f"{{ BonePlayer = {j}, ItemMinLevel = 0, ItemMaxLevel = 15, EffectType = 2, EffectID = 32002, EffectLv = 0, Size = 0.7, R = {r}, G = {g}, B = {b}, PosX = 0.0, PosY = 0.0, PosZ = 0.0, RandTime = 100 }}," for j in range(2, 56, 2)]
    add += NL + f"--destaque set {i}" + NL + f"CUSTOM_SET_EFFECTS[GET_ITEM_MODEL(11, {i})] =" + NL + "{" + NL + NL.join(linhas) + NL + "}" + NL
    n2 += 1
fs.write_bytes(raw[:52] + enc(txt + add))
print('MuAway:', len(AW), 'itens | efeito novo em', n1, 'itens e', n2, 'sets')
for sc, ks in dest.items():
    if sc == 'ALL': print('ALL:', [loja.ITENS.get((8, i), loja.ITENS.get((7, i), {'n': i}))['n'] for i in ks])
    else: print(sc, [('*' if k in AW else '') + loja.ITENS[k]['n'] for k in ks])
