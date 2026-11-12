import sys, re, json; sys.path[:0] = ['.', '../loja']; import linhas as LN, loja
DONATE = ['banned', 'zeus', 'horus', 'poseidon', 'god 2.0', 'holly', 'holly night', 'necromancer', 'armagedom', 'apocalipse 2.0', 'death 3.0', 'blood vampire', 'manticore', 'mystic', 'war 2.0', 'ice dragon', 'death', 'ghost', 'dark raven', 'light hawk']
dl = {}; sec = None; head = []
for l in loja.ITEM_TXT.read_text('latin1').splitlines():
    s = l.strip()
    if s.startswith('//Type'): head = s[2:].split(); continue
    if re.fullmatch(r'\d+', s): sec = int(s); continue
    m = re.match(r'(\d+)\s+(?:-?\d+|\*)\s+\d+\s+\d+\s+\d+\s+\d+\s+\d+\s+\d+\s+"[^"]+"\s*(.*)', s)
    if m and 'DL' in head: r = m[2].split(); i = head.index('DL') - 9; dl[(sec, int(m[1]))] = i < len(r) and r[i] != '0'
def falta(v):
    n = {k: loja.ITENS[k]['n'].lower() for k in v}; s = {k[0] for k in v}
    c = {'asa': 12 in s, 'sword': 0 in s, 'mace': 2 in s, 'scepter': any(k[0] == 2 and dl.get(k) for k in v), 'staff': 5 in s, 'shield': 6 in s,
         'pet': any(k[0] == 13 and re.search('fenrir|spirit|pet', n[k]) for k in v), 'horse': any('horse' in n[k] for k in v),
         'corvo': any(k[0] == 13 and re.search('raven|eagle|hawk', n[k]) for k in v)}
    return [x for x, ok in c.items() if not ok]
EVENTOS = ['gold', 'diamond', 'snow black', 'frost black', 'steel 2.0', 'lord', 'halloween', 'gift christmas', 'abbadon', 'bright red',
           'black christmas', 'sonnar', 'cold', 'tail fox', 'snow', 'santa', 'dark pirate', 'frost', '01 x renew', 'steel']
F = {t: falta(LN.L[t]) for t in DONATE}
def falta_ev(v):
    n = {k: loja.ITENS[k]['n'].lower() for k in v}; s = {k[0] for k in v}
    c = {'sword': 0 in s, 'scepter': any(k[0] == 2 and dl.get(k) for k in v), 'staff': 5 in s, 'shield': 6 in s,
         'kit': any(k[0] == 13 and 'ring' in n[k] for k in v) and any(k[0] == 13 and 'pendant' in n[k] for k in v)}
    return [x for x, ok in c.items() if not ok]
F_EV = {t: falta_ev(LN.L[t]) for t in EVENTOS}
if __name__ == '__main__':
    for t, f in F.items(): print(f'{t:15s}', f)
    print('total', sum(map(len, F.values())))
    for t, f in F_EV.items(): print('EV', f'{t:15s}', f)
