# Cria as pecas que faltam nas linhas DONATE (scepter, pet, horse, corvo) com a cor da linha.
# Pets: copia o modelo de referencia, recolore as texturas na cor da linha e registra (Item.txt 3 salas, nomes do cliente, Lua do cliente).
# Uso: python -I work/criar_pecas_donate.py [--apply]   (backup em work/antes-pecas-donate)
import sys, re, io, json, shutil, struct, colorsys
from pathlib import Path
import numpy as np
from PIL import Image
sys.path.insert(0, 'work'); from mu_merge_common import *
sys.path[:0] = [str(base / 'Integracao/bmd'), str(base / 'Integracao/editor'), str(base / 'Integracao/loja')]
import bmd, faltam
APPLY = '--apply' in sys.argv; FORCE = '--recolor' in sys.argv
BK = work / 'antes-pecas-donate'; BK.mkdir(exist_ok=True)
ITEM = client / 'Data/Item'; LUA = client / 'Data/Configs/Lua'
COR = {'banned': (1.0, .72, .18), 'zeus': (.55, .8, 1.0), 'horus': (1.0, .75, .2), 'poseidon': (.1, .95, .85), 'god 2.0': (1.0, 1.0, .9),
       'holly': (1.0, .85, .45), 'holly night': (.35, .45, 1.0), 'necromancer': (.3, 1.0, .7), 'armagedom': (.85, .02, .02),
       'apocalipse 2.0': (.7, .2, 1.0), 'death 3.0': (.6, .6, .7), 'blood vampire': (0.75, 0.0, 0.08), 'manticore': (1.0, 0.5, 0.1), 'mystic': (0.5, 0.3, 1.0), 'war 2.0': (1.0, 0.35, 0.1), 'ice dragon': (0.6, 0.9, 1.0), 'death': (0.25, 0.35, 0.9), 'ghost': (0.7, 1.0, 1.0), 'dark raven': (0.9, 0.2, 0.6), 'light hawk': (1.0, 1.0, 0.4)}
import json as _j
for _t, _c in _j.load(open('work/cores_linhas.json'))['linhas'].items(): COR[_t] = tuple(_c)  # cor da asa da linha
ESC = {(.85, .02, .02): .8, (.7, .2, 1.0): .85}  # escurece um pouco vermelho e roxo
NOME = {'banned': 'BanneD', 'god 2.0': 'God 2.0', 'holly night': 'Holly Night', 'apocalipse 2.0': 'Apocalipse 2.0', 'death 3.0': 'Death 3.0'}
TAG = lambda t: re.sub(r'[^A-Za-z0-9]', '', NOME.get(t, t.title()))
# referencia de cada tipo de pet: (secao, index, modelo icone, modelo objeto, arquivo lua)
REF = {'horse': (13, 246, 'icon_Horseholly', 'Horseholly', 'helper'), 'pet': (13, 216, 'icon_FenrirHoly', None, 'helper'),
       'corvo': (13, 268, 'icon_EagleZeus', 'EagleZeus', 'spirit')}
pay = lambda d: bytes(v ^ lua_key[i % len(lua_key)] ^ ((i - 0x56) & 255) for i, v in enumerate(d))

def save(p, data):
    d = BK / p.relative_to(base); d.parent.mkdir(parents=True, exist_ok=True)
    if not d.exists() and p.exists(): shutil.copy2(p, d)
    p.write_bytes(data)

def recolor(raw, ext, cor):
    skip = 24 if ext == '.ozj' else 4
    im = Image.open(io.BytesIO(raw[skip:])); mode = im.mode; a = np.asarray(im.convert('RGBA')).astype(float) / 255
    th, ts, tv = colorsys.rgb_to_hsv(*cor)
    rgb = a[..., :3]; mx = rgb.max(-1); mn = rgb.min(-1); v = mx; s = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
    ns = np.clip(np.maximum(s, .85), 0, 1) if ts > .2 else s * .15  # cor forte: saturacao alta (nao fica rosado/pastel)
    nv = np.clip(v * (1.15 if ts < .2 else ESC.get(cor, .9)), 0, 1)
    h6 = th * 6; i = np.floor(h6); f = h6 - i; p_ = nv * (1 - ns); q = nv * (1 - ns * f); t_ = nv * (1 - ns * (1 - f))
    i = int(i) % 6; R, G, B = [(nv, t_, p_), (q, nv, p_), (p_, nv, t_), (p_, q, nv), (t_, p_, nv), (nv, p_, q)][i]
    out = np.stack([R, G, B, a[..., 3]], -1)
    out = np.where((v < .06)[..., None], a, out)  # preto continua preto
    img = Image.fromarray((out * 255).astype(np.uint8), 'RGBA')
    b = io.BytesIO()
    if ext == '.ozj': img.convert('RGB').save(b, 'JPEG', quality=92)
    else: (img if mode in ('RGBA', 'LA', 'P') else img.convert('RGB')).save(b, 'TGA')
    return raw[:skip] + b.getvalue()

def clonar_modelo(nome, tag, cor):
    src = ITEM / f'{nome}.bmd'; m = bmd.read(src); novo = f'{nome}_{tag}'
    for me in m['meshes']:
        tn = me['texname']; st, ext = tn.rsplit('.', 1)[0], None
        for e in ('.ozj', '.ozt'):
            q = ITEM / (st + e)
            if q.exists(): ext = e; break
        if not ext: continue
        import hashlib; nt = f'dn{tag[:12]}' + hashlib.md5(f'{st}_{tag}'.encode()).hexdigest()[:6]  # nome curto (BMD guarda so 32 letras)
        if APPLY and (FORCE or not (ITEM / (nt + ext)).exists()): (ITEM / (nt + ext)).write_bytes(recolor((ITEM / (st + ext)).read_bytes(), ext, cor))
        me['texname'] = nt + ('.jpg' if ext == '.ozj' else '.tga')
    if APPLY: bmd.write(m, ITEM / f'{novo}.bmd')
    return novo

cat = read_catalog(server / 'Salas/SalaTrade/Data/Item/Item.txt')
tables = {loc: read_bmd(client / 'Data/Local' / loc) for loc in locations}
usados = set(cat)
def livre(g, start):
    i = next(i for i in range(start, 512) if (g, i) not in usados and all(not item_name(t, g, i) for t in tables.values())); usados.add((g, i)); return i

def add_item_txt(g, ref, idx, nome, so_dl=False):
    for r in ('SalaTrade', 'SalaUpar', 'SalaVip'):
        p = server / f'Salas/{r}/Data/Item/Item.txt'; t = p.read_bytes().decode('cp1252'); eol = '\r\n' if '\r\n' in t else '\n'
        parts = re.split(r'(?im)^(end[ \t]*)(\r?\n|$)', t); sec = parts[3 * g]
        line = next(l for l in sec.splitlines() if re.match(rf'\s*{ref}\s', l))
        new = re.sub(rf'^\s*{ref}(\s)', rf'{idx}\1', line, 1); new = re.sub(r'"[^"]*"', f'"{nome}"', new, 1)
        if so_dl:  # classes: so DL (as 7 ultimas colunas = DW DK FE MG DL SU RF)
            m = re.match(r'(.*"[^"]*")(.*)$', new); v = m[2].split()
            for j in range(14, len(v)): v[j] = '0'
            v[18] = '1'; new = m[1] + '\t' + '\t'.join(v)  # depois do nome: 14 atributos + DW DK FE MG DL SU
        parts[3 * g] = sec + new + eol; save(p, ''.join(parts).encode('cp1252'))

def add_nome_cliente(g, ref, idx, nome):
    for loc, t in tables.items():
        a, b = offset(g, ref), offset(g, idx); t[b:b + 84] = t[a:a + 84]; t[b:b + 30] = nome.encode('cp1252')[:29].ljust(30, b'\0')

def lua_edit(rel, fn):
    p = LUA / rel; old = p.read_bytes(); txt = pay(old[52:]).decode('cp1252'); novo = fn(txt)
    if novo != txt: save(p, old[:52] + pay(novo.encode('cp1252')))

def _mesmo(atual, nome):  # nome no Item.txt pode estar cortado pela marca [EXCLUSIVO]/[LIMITADO]
    b = re.sub(r'\s*\[(EXCLUSIVO|LIMITADO)\]', '', atual).strip()
    return b == nome or (len(b) >= 12 and nome.startswith(b))
feitos = []
if FORCE:
    APPLY = True
    for t_, cor in COR.items():
        tag = TAG(t_)
        for tipo, (g, ref, icon, obj, kind) in REF.items():
            for nm in (icon, obj):
                if nm and (ITEM / f'{nm}_{tag}.bmd').exists(): clonar_modelo(nm, tag, cor)
    print('texturas refeitas'); raise SystemExit
for t, faltando in list(faltam.F.items()) + [(t_, [x for f in fs for x in (['ring', 'pendant'] if f == 'kit' else [f])]) for t_, fs in faltam.F_EV.items()]:
    cor = COR.get(t, (1.0, .8, .3)); tag = TAG(t); N = NOME.get(t, t.title())
    if t == 'banned': faltando = ['horse', 'pet']  # o Spirit BanneD ja e o corvo
    for tipo in faltando:
        if tipo == 'scepter' and not [k for k in faltam.LN.L[t] if k[0] == 2]: tipo = 'scepter_gen'
        if tipo == 'scepter':
            mace = sorted(k for k in faltam.LN.L[t] if k[0] == 2)
            ref = mace[0][1]; nome = f'Scepter of {N}'
            if any(_mesmo(v[0], nome) for v in cat.values()): continue
            idx = livre(2, 300)
            feitos.append((t, nome, f'2:{idx}'))
            if APPLY:
                add_item_txt(2, ref, idx, nome, so_dl=True); add_nome_cliente(2, ref, idx, nome)
                def f(txt, ref=ref, idx=idx):
                    m = re.search(rf"LoadItem\(GET_ITEM_MODEL\(2, {ref}\)[^\n]*", txt)
                    return txt.replace(m[0], m[0] + '\r\n\t' + m[0].replace(f'(2, {ref})', f'(2, {idx})'), 1) if m and f'(2, {idx})' not in txt else txt
                lua_edit('Configs/LoadItens.lua', f)
            continue
        GEN = {'staff': (5, 108, 'Staff108', 'Staff of {}'), 'asa': (12, 221, 'Wing311', 'Wing of {}'), 'sword': (0, 163, 'Sword163', 'Sword of {}'),
               'shield': (6, 154, 'Shield154', 'Shield of {}'), 'ring': (13, 430, 'Helper23', 'Ring of {}'), 'pendant': (13, 431, 'Helper17', 'Pendant of {}'), 'scepter_gen': (2, 126, 'Mace126', 'Scepter of {}')}
        if tipo in GEN:
            g, ref, mod, fmt = GEN[tipo]; nome = fmt.format(N)
            if any(_mesmo(v[0], nome) for v in cat.values()): continue
            idx = livre(g, {5: 300, 12: 400, 13: 120}.get(g, 320)); feitos.append((t, nome, f'{g}:{idx}'))
            if not APPLY: continue
            nm = clonar_modelo(mod, tag, cor); add_item_txt(g, ref, idx, nome, so_dl=(tipo == 'scepter_gen')); add_nome_cliente(g, ref, idx, nome)
            if g != 12:
                def fl(txt, g=g, ref=ref, idx=idx, nm=nm, mod=mod):
                    if f'GET_ITEM_MODEL({g}, {idx})' in txt: return txt
                    l0 = next(l for l in txt.splitlines() if f'GET_ITEM_MODEL({g}, {ref})' in l)
                    return txt.replace(l0, l0 + chr(13) + chr(10) + l0.replace(f'({g}, {ref})', f'({g}, {idx})').replace(repr(mod), repr(nm)), 1)
                lua_edit('Configs/LoadItens.lua', fl)
            else:
                for rel in ('Configs/CustomWings.lua', 'Configs/Configs/CustomWings.lua'):
                    if not (LUA / rel).exists(): continue
                    def fw(txt, idx=idx, nm=nm):
                        if f'(12, {idx})' in txt: return txt
                        l0 = next(l for l in txt.splitlines() if 'GET_ITEM(12, 221)' in l)
                        return txt.replace(l0, l0 + '\r\n' + l0.replace('(12, 221)', f'(12, {idx})').replace('"Wing311"', f'"{nm}"'), 1)
                    lua_edit(rel, fw)
                for r in ('SalaTrade', 'SalaUpar', 'SalaVip'):
                    p = server / f'Salas/{r}/Data/Custom/CustomWing.txt'; tx = p.read_bytes().decode('cp1252')
                    line = next(l for l in tx.splitlines() if re.match(r'\s*\d+\s+6365\s', l))
                    num = max(int(l.split()[0]) for l in tx.splitlines() if re.match(r'\s*\d+\s+\d+\s', l)) + 1
                    nl = re.sub(r'^\s*\d+(\s+)6365(\s)', lambda m: f'{num}{m[1]}{6144 + idx}{m[2]}', line, 1).replace('"Wing311"', f'"{nm}"')
                    save(p, tx.replace(line, line + '\r\n' + nl, 1).encode('cp1252'))
            continue
        g, ref, icon, obj, kind = REF[tipo]
        idx = livre(13, 450)
        nome = {'horse': f'Horse of {N}', 'pet': f'Fenrir {N}', 'corvo': f'Eagle of {N}'}[tipo]
        if any(_mesmo(v[0], nome) for v in cat.values()): continue  # ja existe
        feitos.append((t, nome, f'13:{idx}'))
        if not APPLY: continue
        ni = clonar_modelo(icon, tag, cor); no = clonar_modelo(obj, tag, cor) if obj else None
        add_item_txt(13, ref, idx, nome); add_nome_cliente(13, ref, idx, nome)
        for rel in ('Configs/CustomItemPosition.lua', 'Configs/Configs/CustomItemPosition.lua'):
            lua_edit(rel, lambda txt: txt if f'GET_ITEM(13, {idx})' in txt else re.sub(rf"(\{{ItemIndex = GET_ITEM\(13, {ref}\)[^\n]*)", lambda m: m[1] + '\r\n' + m[1].replace(f'(13, {ref})', f'(13, {idx})'), txt, 1))
        if kind == 'spirit':
            lua_edit('CharacterSystem/DarkSpirit.lua', lambda txt: txt if f'(13, {idx})' in txt else re.sub(
                rf"(\{{ ItemIndex = GET_ITEM\(13, {ref}\)[^\n]*)", lambda m: m[1] + '\r\n    ' + m[1].replace(f'(13, {ref})', f'(13, {idx})').replace(f"'{icon}'", f"'{ni}'").replace(f"'{obj}'", f"'{no}'"), txt, 1))
        else:
            def fh(txt):
                if f'GET_ITEM_MODEL(13, {idx})' in txt: return txt
                m = re.search(rf"\{{ ItemIndex = GET_ITEM_MODEL\(13, {ref}\), Type[^\n]*", txt)
                nl = m[0].replace(f'(13, {ref})', f'(13, {idx})').replace(f"'{icon}'", f"'{ni}'")
                if obj: nl = nl.replace(f"'{obj}'", f"'{no}'")
                txt = txt.replace(m[0], m[0] + '\r\n' + nl, 1)
                g0 = re.search(rf"HELPER_CONFIG_GLOW\[GET_ITEM_MODEL\(13, {ref}\)\] = \{{.*?\n\}}", txt, re.S)
                if g0: txt = txt.replace(g0[0], g0[0] + '\r\n' + g0[0].replace(f'(13, {ref})', f'(13, {idx})'), 1)
                return txt
            lua_edit('CharacterSystem/CharacterHelper.lua', fh)
if APPLY:
    for loc, t in tables.items():
        e = xor(bytes(t), item_key); save(client / 'Data/Local' / loc, e + struct.pack('<I', checksum(e)))
for f in feitos: print(*f)
print(len(feitos), 'pecas', 'CRIADAS' if APPLY else '(simulacao)')
