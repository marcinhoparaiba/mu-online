# Agrupa itens por "linha" (tema do nome: BanneD, Abbadon, Gold, Holly...) e mostra as que tem mais categorias.
import sys, re, collections
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'loja')); import loja
GEN = r"\b(sword|blade|wing|wings|cape|armor|helm|helmet|pants?|gloves?|boots?|shield|staff|stick|mace|scepter|hammer|bow|crossbow|spear|lance|axe|pet|ring|pendant|of|the|female|fem|male|skin\s*\d*|box|set|mini|claw|book|rune|orb|jewel|spirit|horse|fenrir|dinorant|eagle|scroll|arrows?|bolt|wand|parchment)\b|\[[^\]]*\]|\(.*?\)|\b[mf]\b"
def tema(n):
    t = re.sub(GEN, ' ', n.lower()); t = re.sub(r'[^a-z0-9. ]', ' ', t)
    return ' '.join(t.split())
L = collections.defaultdict(list)
for (s, i), it in loja.ITENS.items():
    if s > 13: continue
    k = tema(it['n'])
    if k and len(k) > 2: L[k].append((s, i))
def cats(v): return {('set' if 7 <= s <= 11 else s) for s, i in v}
rank = sorted(L.items(), key=lambda kv: (len(cats(kv[1])), len(kv[1])), reverse=True)
if __name__ == '__main__':
    for k, v in rank[:45]: print(f'{k:22s} cats={len(cats(v)):2d} itens={len(v):3d}', sorted(cats(v), key=str))
