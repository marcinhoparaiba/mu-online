# Loja de edicao do MuBanneD: lista todos os itens (sem preco), [editar] e manda pro bau ativo da conta.
# Uso: python loja.py   -> abre http://127.0.0.1:8095
# Feche o bau no jogo antes de mandar (o jogo grava o bau aberto por cima ao fechar).
import json, re, subprocess, time, webbrowser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ITEM_TXT = ROOT / '1 - MuServer 97d+5.2 Aprendizmuonline/Salas/SalaTrade/Data/Item/Item.txt'
SQL = ['sqlcmd', '-S', r'.\MUBANNEDTEST', '-E', '-C', '-b', '-h', '-1', '-W', '-s', '|', '-d', 'MuBanneD52Integrado', '-Q']
COLS, ROWS = 8, 15

def sql(q):
    return subprocess.run(SQL + ['SET NOCOUNT ON;' + q], capture_output=True, text=True, check=True).stdout

def load_items():
    itens, sec, head = {}, None, []
    for l in ITEM_TXT.read_text('latin1').splitlines():
        s = l.strip()
        if s.startswith('//Type'): head = s[2:].split(); continue
        s = s.split('//')[0].strip() if not s.startswith('"') else s
        if re.fullmatch(r'\d+', s): sec = int(s); continue
        if s == 'end' or not s or sec is None: continue
        m = re.match(r'(\d+)\s+(-?\d+|\*)\s+(\d+)\s+(\d+)\s+(\d+)\s+\d+\s+\d+\s+\d+\s+"([^"]+)"\s*(.*)', s)
        if not m: continue
        rest = m[7].split()
        dur = 255 if 'Durability' in head else 1  # sem durabilidade (pocoes, joias): quantidade 1
        if 'Durability' in head:
            k = head.index('Durability') - 9
            if 0 <= k < len(rest) and rest[k].isdigit(): dur = min(int(rest[k]), 255)
        itens[(sec, int(m[1]))] = dict(s=sec, i=int(m[1]), n=m[6], w=int(m[4]), h=int(m[5]), d=dur)
    return itens

ITENS = load_items()

def encode(it, o):
    idx, lv, op = it['i'], int(o.get('lv', 0)), int(o.get('op', 0))
    b = bytearray(b'\xff' * 16)
    b[0] = idx & 0xFF
    b[1] = (0x80 if o.get('sk') else 0) | (lv << 3) | (4 if o.get('lu') else 0) | (op & 3)
    b[2] = it['d'] or 255
    b[3:7] = (int(time.time() * 10) & 0x7FFFFFFF).to_bytes(4, 'big')
    b[7] = (0x80 if idx & 0x100 else 0) | (0x40 if op & 4 else 0) | (int(o.get('ex', 0)) & 0x3F)
    b[8] = int(o.get('an', 0))
    b[9] = (it['s'] << 4) | ((idx >> 9) & 0x0F if idx > 0x1FF else 0)
    b[10] = 0
    return bytes(b)

def grid(data):
    used = [[False] * COLS for _ in range(ROWS)]
    for slot in range(len(data) // 16):
        r = data[slot * 16: slot * 16 + 16]
        if r[0] == 0xFF and r[9] >> 4 == 0xF: continue
        idx = r[0] | (0x100 if r[7] & 0x80 else 0)
        it = ITENS.get((r[9] >> 4, idx), {'w': 1, 'h': 1})
        y, x = divmod(slot, COLS)
        for dy in range(it['h']):
            for dx in range(it['w']):
                if y + dy < ROWS and x + dx < COLS: used[y + dy][x + dx] = True
    return used

def put(acc, key, o):
    it = ITENS[key]
    h = sql(f"SELECT CONVERT(varchar(max),Items,2) FROM warehouse WHERE AccountID='{acc}'").strip()
    if not h: return 'Conta sem bau criado (abra o bau uma vez no jogo).'
    data = bytearray.fromhex('' if h == 'NULL' else h)
    data += b'\xff' * (COLS * ROWS * 16 - len(data))
    used = grid(data)
    for y in range(ROWS - it['h'] + 1):
        for x in range(COLS - it['w'] + 1):
            if all(not used[y + dy][x + dx] for dy in range(it['h']) for dx in range(it['w'])):
                s = y * COLS + x
                data[s * 16: s * 16 + 16] = encode(it, o)
                sql(f"UPDATE warehouse SET Items=0x{data.hex().upper()} WHERE AccountID='{acc}'")
                return f'OK: {it["n"]} +{o.get("lv", 0)} no bau de {acc} (linha {y + 1}, coluna {x + 1}).'
    return 'Bau cheio: sem espaco para esse item.'

PAGE = r'''<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>Loja MuBanneD</title>
<style>:root{--bg:#141414;--c:#222;--t:#eee;--a:#d4a017}body{font:14px system-ui;margin:16px;background:var(--bg);color:var(--t)}
input,select,button{font:inherit;background:#2b2b2b;color:var(--t);border:1px solid #444;border-radius:6px;padding:6px}
button{cursor:pointer}#lista div{display:flex;justify-content:space-between;align-items:center;background:var(--c);margin:3px 0;padding:6px 10px;border-radius:6px}
#ed{position:fixed;inset:0;background:#000a;display:none;align-items:center;justify-content:center}#ed>div{background:#1d1d1d;padding:16px;border-radius:10px;width:min(420px,92vw)}
label{display:block;margin:6px 0}small{color:#999}#msg{color:var(--a);margin:8px 0}</style>
<h1>Loja MuBanneD</h1><p><small>Feche o baú no jogo antes de mandar. O item vai para o baú ativo da conta.</small></p>
Conta: <select id=acc></select> <input id=q placeholder="buscar item..." oninput=lista()> <select id=sec onchange=lista()><option value="">todas as categorias</option></select>
<div id=msg></div><div id=lista></div>
<div id=ed><div><h3 id=nome></h3>
<label>Nível <select id=lv></select></label><label>Adicional <select id=op></select></label>
<label><input type=checkbox id=sk> Skill</label><label><input type=checkbox id=lu> Luck</label>
<div>Excelentes:<div id=exs></div></div><label>Ancient <select id=an><option value=0>não</option><option value=5>+5</option><option value=9>+10</option><option value=6>+5 (2)</option><option value=10>+10 (2)</option></select></label>
<button onclick=mandar()>Mandar pro baú</button> <button onclick="ed.style.display='none'">Fechar</button></div></div>
<script>
const SEC=['Espadas','Machados','Maças/Cetros','Lanças','Arcos/Bestas','Cajados','Escudos','Elmos','Armaduras','Calças','Luvas','Botas','Asas/Orbs/Joias','Pets/Anéis/Colares','Poções/Joias','Pergaminhos'];
let I=[],cur;
fetch('/itens').then(r=>r.json()).then(d=>{I=d.itens;acc.innerHTML=d.contas.map(c=>`<option>${c}</option>`).join('');
sec.innerHTML+=SEC.map((s,i)=>`<option value=${i}>${i} ${s}</option>`).join('');lista()});
for(let i=0;i<16;i++)lv.innerHTML+=`<option value=${i}>+${i}</option>`;for(let i=0;i<8;i++)op.innerHTML+=`<option value=${i}>+${i*4}</option>`;
['Mana/HP por kill','Vida/HP +%','Dano +nível/20 · Defesa','Dano +2% · Refletir','Vel. ataque · Redução dano','Zen/Exc dano'].forEach((t,i)=>exs.innerHTML+=`<label><input type=checkbox class=ex value=${1<<(5-i)}> ${t}</label>`);
function lista(){const q=document.getElementById('q').value.toLowerCase(),s=sec.value;
lista_.innerHTML=I.filter(x=>(s===''||x.s==s)&&x.n.toLowerCase().includes(q)).slice(0,400).map(x=>`<div><span>${x.n} <small>(${x.s}:${x.i})</small></span><button onclick="abrir(${x.s},${x.i})">[editar]</button></div>`).join('')}
const lista_=document.getElementById('lista');
function abrir(s,i){cur=I.find(x=>x.s==s&&x.i==i);nome.textContent=cur.n;ed.style.display='flex'}
function mandar(){const ex=[...document.querySelectorAll('.ex:checked')].reduce((a,b)=>a|+b.value,0);
fetch('/mandar',{method:'POST',body:JSON.stringify({acc:acc.value,s:cur.s,i:cur.i,lv:lv.value,op:op.value,sk:sk.checked,lu:lu.checked,ex,an:an.value})}).then(r=>r.text()).then(t=>{msg.textContent=t;ed.style.display='none'})}
</script>'''

class H(BaseHTTPRequestHandler):
    def send(self, body, ct='text/html; charset=utf-8'):
        b = body.encode('utf-8'); self.send_response(200); self.send_header('Content-Type', ct); self.end_headers(); self.wfile.write(b)
    def do_GET(self):
        if self.path == '/itens':
            contas = [c for c in sql('SELECT AccountID FROM warehouse ORDER BY AccountID').split() if c]
            self.send(json.dumps({'itens': list(ITENS.values()), 'contas': contas}), 'application/json')
        else: self.send(PAGE)
    def do_POST(self):
        o = json.loads(self.rfile.read(int(self.headers['Content-Length'])))
        acc = re.sub(r'[^A-Za-z0-9_]', '', o['acc'])
        try: self.send(put(acc, (int(o['s']), int(o['i'])), o))
        except Exception as e: self.send(f'Erro: {e}')
    def log_message(self, *a): pass

if __name__ == '__main__':
    srv = ThreadingHTTPServer(('127.0.0.1', 8095), H)
    print('Loja em http://127.0.0.1:8095'); webbrowser.open('http://127.0.0.1:8095'); srv.serve_forever()
