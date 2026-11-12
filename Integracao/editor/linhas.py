# Agrupa itens por "linha" (tema do nome: BanneD, Abbadon, Gold, Holly...) e mostra as que tem mais categorias.
import sys, re, collections
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'loja')); import loja
GEN = r"\b(sword|blade|wing|wings|cape|armor|helm|helmet|pants?|gloves?|boots?|shield|staff|stick|mace|scepter|hammer|bow|crossbow|spear|lance|axe|pet|ring|pendant|of|the|female|fem|male|skin\s*\d*|box|set|mini|claw|book|rune|orb|jewel|spirit|horse|fenrir|dinorant|eagle|scroll|arrows?|bolt|wand|parchment)\b|\[[^\]]*\]|\(.*?\)|\b[mf]\b"
def tema(n):
    t = re.sub(GEN, ' ', n.lower()); t = re.sub(r'[^a-z0-9. ]', ' ', t)
    return ' '.join(t.split())
L = collections.defaultdict(list)
# nomes originais (antes de [EXCLUSIVO]/[LIMITADO], que podem cortar o fim do nome): backup em work/antes-tags
import re as _re
from pathlib import Path as _P
_ORIG = {}
_bk = _P(__file__).resolve().parents[4] / 'work/antes-tags/Item.SalaTrade.txt'
if _bk.exists():
    _sec = None
    for _l in _bk.read_text('cp1252').splitlines():
        _s = _l.strip()
        if _re.fullmatch(r'\d+', _s): _sec = int(_s); continue
        _m = _re.match(r'(\d+)\s+(?:-?\d+|\*)\s+\d+\s+\d+\s+\d+\s+\d+\s+\d+\s+\d+\s+"([^"]*)"', _s)
        if _m and _sec is not None: _ORIG[(_sec, int(_m[1]))] = _m[2]
for (s, i), it in loja.ITENS.items():
    if s > 13: continue
    k = tema(_ORIG.get((s, i), it['n']))
    if k and len(k) > 2: L[k].append((s, i))
def cats(v): return {('set' if 7 <= s <= 11 else s) for s, i in v}
rank = sorted(L.items(), key=lambda kv: (len(cats(kv[1])), len(kv[1])), reverse=True)
if __name__ == '__main__':
    for k, v in rank[:45]: print(f'{k:22s} cats={len(cats(v)):2d} itens={len(v):3d}', sorted(cats(v), key=str))
