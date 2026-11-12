# Troca o modelo dos aneis/pendants criados para as linhas de EVENTO por modelos de anel/colar de verdade, no tema da linha.
import sys, re
src = open('work/criar_pecas_donate.py', encoding='utf-8').read().split('cat = read_catalog')[0]
sys.argv = ['x', '--apply']; exec(src)
TEMA = {'gift christmas': 109, 'black christmas': 109, 'santa': 109, 'halloween': 106, 'dark pirate': 106,
        'cold': 102, 'frost': 102, 'frost black': 102, 'snow': 102, 'snow black': 102, 'tail fox': 102, 'sonnar': 108,
        'bright red': 111, 'gold': 104, 'diamond': 100, 'lord': 105, 'abbadon': 110, 'steel': 103, 'steel 2.0': 103, '01 x renew': 105}
ORIG = {'gift christmas', 'santa'}  # Natal: mantem as cores originais do modelo
import json; LIN = json.load(open('work/cores_linhas.json'))['linhas']
txt = lambda p: pay(p.read_bytes()[52:]).decode('cp1252')
li = txt(LUA / 'Configs/LoadItens.lua'); n = 0
for t, num in TEMA.items():
    N = NOME.get(t, t.title()); tag = TAG(t); cor = tuple(LIN.get(t, (1, .8, .3)))
    for tipo, mbase in (('Ring', f'Ring{num}'), ('Pendant', f'Pendant{num}')):
        alvo = None
        for (s, i), v in cat.items() if False else []: pass
        m = re.search(rf"GET_ITEM_MODEL\(13, (\d+)\)[^\n']*'Helper(?:23|17)_{tag}'", li)
        ks = [int(x) for x in re.findall(rf"GET_ITEM_MODEL\(13, (\d+)\)[^\n']*'Helper{'23' if tipo == 'Ring' else '17'}_{tag}'", li)]
        if not ks: continue
        nm = mbase if t in ORIG else clonar_modelo(mbase, tag, cor)
        for k in ks:
            li = re.sub(rf"(GET_ITEM_MODEL\(13, {k}\)[^\n']*')Helper(?:23|17)_{tag}(')", rf"\g<1>{nm}\2", li); n += 1
p = LUA / 'Configs/LoadItens.lua'; old = p.read_bytes(); save(p, old[:52] + pay(li.encode('cp1252')))
print('kits trocados', n)
