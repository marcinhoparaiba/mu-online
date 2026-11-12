# Cada linha DONATE ganha brilho com a sua personalidade (cor e intensidade) em todas as pecas: armas, escudo, asa/capa, pets e set completo.
import shutil
exec(open('destaques.py', encoding='utf-8').read().split('def away(k):')[0])
import linhas as LN
PERS = {  # linha: (R, G, B, tamanho)  -- deuses, anjos, demonios
    'banned': (1.0, .72, .18, 1.6), 'zeus': (.55, .8, 1.0, 1.7), 'horus': (1.0, .75, .2, 1.6), 'poseidon': (.1, .95, .85, 1.7),
    'god 2.0': (1.0, 1.0, .9, 1.6), 'holly': (1.0, .85, .45, 1.5), 'holly night': (.35, .45, 1.0, 1.6),
    'necromancer': (.3, 1.0, .7, 1.8), 'armagedom': (1.0, .1, .05, 1.8), 'apocalipse 2.0': (.7, .2, 1.0, 1.8), 'death 3.0': (.6, .6, .7, 1.7),
    'blood vampire': (0.75, 0.0, 0.08, 1.7), 'manticore': (1.0, 0.5, 0.1, 1.7), 'mystic': (0.5, 0.3, 1.0, 1.7), 'war 2.0': (1.0, 0.35, 0.1, 1.7), 'ice dragon': (0.6, 0.9, 1.0, 1.7), 'death': (0.25, 0.35, 0.9, 1.7), 'ghost': (0.7, 1.0, 1.0, 1.7), 'dark raven': (0.9, 0.2, 0.6, 1.7), 'light hawk': (1.0, 1.0, 0.4, 1.7)}
bk = W / 'antes-personalidade'; bk.mkdir(exist_ok=True)
enc = lambda txt: bytes(v ^ key0[i % len(key0)] ^ ((i - 0x56) & 255) for i, v in enumerate(txt.encode('cp1252')))
fi = LUA / 'EffectSystem/CharacterEffectItens.lua'; fs = LUA / 'EffectSystem/CharacterSetEffect.lua'
for f in (fi, fs):
    if not (bk / f.name).exists(): shutil.copy2(f, bk / f.name)
ti, ts = dec((bk / fi.name).read_bytes()), dec((bk / fs.name).read_bytes())  # sempre parte do backup: rodar de novo nao duplica
ai = as_ = ''; n1 = n2 = 0
import json as _j; _C = _j.load(open(W / 'cores_linhas.json'))  # cor real de cada item e da linha (work/cores_itens.py)
for t, (r0, g0, b0, sz) in PERS.items():
    lr, lg, lb = _C['linhas'].get(t, (r0, g0, b0))
    for k in LN.L[t]:
        if k[0] in (0, 1, 2, 3, 4, 5, 6, 12, 13):
            r, g, b = _C['itens'].get(f'{k[0]},{k[1]}', (lr, lg, lb))
            f = F.get(modelo.get(k, ''))
            if not f: continue
            bones = [j for j, x in enumerate(bmd.read(f)['bones']) if x][:24]
            if not bones: continue
            ai += NL + f"--{t} {loja.ITENS[k]['n']}" + NL + f"CUSTOM_EFFECT_INFOS[GET_ITEM_MODEL({k[0]}, {k[1]})] = {{" + NL + NL.join(
                f"{{ Type = 0, EffectID = 32002, EffectLv = 0, Bone = {j}, Size = {sz:.2f}, ColorR = {r}, ColorG = {g}, ColorB = {b}, Black = 0, RandTime = 100 }}," for j in bones) + NL + "}" + NL; n1 += 1
        elif k[0] == 11:
            r, g, b = lr, lg, lb
            as_ += NL + f"--{t} set {k[1]}" + NL + f"CUSTOM_SET_EFFECTS[GET_ITEM_MODEL(11, {k[1]})] =" + NL + "{" + NL + NL.join(
                f"{{ BonePlayer = {j}, ItemMinLevel = 0, ItemMaxLevel = 15, EffectType = 2, EffectID = 32002, EffectLv = 0, Size = {sz * .5:.2f}, R = {r}, G = {g}, B = {b}, PosX = 0.0, PosY = 0.0, PosZ = 0.0, RandTime = 100 }}," for j in range(2, 56)) + NL + "}" + NL; n2 += 1
fi.write_bytes((bk / fi.name).read_bytes()[:52] + enc(ti + ai))
fs.write_bytes((bk / fs.name).read_bytes()[:52] + enc(ts + as_))
print('personalidade:', n1, 'itens e', n2, 'sets')
