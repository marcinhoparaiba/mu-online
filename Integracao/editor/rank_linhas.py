# Ranking das linhas por beleza: cor viva, cor unica (todo o kit numa cor), efeitos e animacao.
import sys, json, numpy as np
from pathlib import Path
src = open('destaques.py', encoding='utf-8').read().split('CLASSICO =')[0]
exec(src)
import linhas as LN
anim = {}
def animado(k):
    f = F.get(modelo.get(k, ''))
    try: return f is not None and max(a[0] for a in bmd.read(f)['actions']) > 1
    except Exception: return False
res = []
for t, v in LN.L.items():
    cats = {('set' if 7 <= s <= 11 else s) for s, i in v}
    if len(cats) < 6 or t == 'banned': continue
    vs = [VIS[k] for k in v if VIS.get(k)]
    if len(vs) < 4: continue
    sat = float(np.mean([x['sat'] for x in vs]))
    ang = np.exp(2j * np.pi * np.array([x['hue'] for x in vs])); uni = float(abs(ang.mean()))  # 1 = todas as pecas na mesma cor
    hue = (np.angle(ang.mean()) / (2 * np.pi)) % 1
    ef = sum(1 for k in v if k in efeito_atual) / len(v)
    an = sum(1 for k in v if k[0] in (12, 13) and animado(k))
    nota = sat * 2.0 + uni * 1.0 + ef * 1.0 + min(an, 3) * 0.15 + len(cats) * 0.08
    res.append((nota, t, len(cats), round(sat, 2), round(uni, 2), round(ef, 2), an, round(hue * 360)))
res.sort(reverse=True)
for r in res[:18]: print('%.2f %-16s cats=%d sat=%.2f cor_unica=%.2f efeito=%.2f anim=%d matiz=%d' % r)
json.dump([r[1] for r in res[:10]], open('donate_linhas.json', 'w'))
