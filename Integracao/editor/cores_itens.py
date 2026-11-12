# Cor real de cada item DONATE (moda do matiz ponderada) + cor da linha = cor da asa original.
import sys, re, json, colorsys, numpy as np
from pathlib import Path
exec(open('work/verifica_visual.py', encoding='utf-8').read().split('P = []')[0])
def cor(f):
    im = render(f)
    if im is None: return None
    a = np.asarray(im).reshape(-1, 4); a = a[a[:, 3] > 0][:, :3] / 255
    if not len(a): return None
    h = np.array([colorsys.rgb_to_hsv(*c) for c in a[::4]]); w = h[:, 1] * h[:, 2]
    if (w > .25).sum() < 40: return (1.0, 1.0, .95)
    hist, ed = np.histogram(h[:, 0], bins=72, range=(0, 1), weights=w ** 2); i = hist.argmax()
    return tuple(round(float(x), 2) for x in colorsys.hsv_to_rgb((ed[i] + ed[i + 1]) / 2, .85, 1.0))
ITEM_COR = {}; LINHA = {}
for t in faltam.DONATE + faltam.EVENTOS:
    asa = None
    for k in sorted(faltam.LN.L[t]):
        if 7 <= k[0] <= 11: continue
        f = F.get(modelo.get(k, ''))
        if not f: continue
        c = cor(f)
        if c: ITEM_COR[f'{k[0]},{k[1]}'] = c
        if c and k[0] == 12 and asa is None and '_' not in f.stem: asa = c
    if not asa:  # sem asa: a cor mais comum entre as pecas coloridas da linha
        cs = [ITEM_COR[f'{k[0]},{k[1]}'] for k in faltam.LN.L[t] if f'{k[0]},{k[1]}' in ITEM_COR and ITEM_COR[f'{k[0]},{k[1]}'] != (1.0, 1.0, .95)]
        asa = max(set(cs), key=cs.count) if cs else (1.0, 1.0, .95)
    LINHA[t] = asa
    print(f'{t:15s} linha {LINHA[t]}')
json.dump({'itens': ITEM_COR, 'linhas': LINHA}, open('work/cores_linhas.json', 'w'))
