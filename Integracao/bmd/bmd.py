import struct
class R:
    def __init__(s,d): s.d=d; s.o=0
    def u(s,f):
        v=struct.unpack_from('<'+f,s.d,s.o); s.o+=struct.calcsize('<'+f); return v
def cstr(b): return b.split(b'\0')[0].decode('latin1')
def read(path):
    d=open(path,'rb').read()
    if d[:4]==bytes([66,77,68,12]):
        K=bytes.fromhex('d17352f6d29acb273eaf593137b3e7a2'); p=0x5e; o=bytearray([66,77,68,10])
        for i,c in enumerate(d[8:]): o.append(((c^K[i%16])-p)&255); p=(c+0x3d)&255
        d=bytes(o)
    assert d[:3]==b'BMD' and d[3]==0x0A, d[:4]
    r=R(d); r.o=4
    m={'name':cstr(r.u('32s')[0])}; nm,nb,na=r.u('3h'); m['meshes']=[]
    for _ in range(nm):
        v,n,t,tri,tex=r.u('5h'); me={'tex':tex}
        me['v']=[r.u('hh3f') for _ in range(v)]
        me['n']=[r.u('hh3fhh') for _ in range(n)]
        me['t']=[r.u('2f') for _ in range(t)]
        me['tri']=[r.o and d[r.o+64*i:r.o+64*(i+1)] for i in range(tri)]; r.o+=64*tri
        me['texname']=cstr(r.u('32s')[0]); m['meshes'].append(me)
    m['actions']=[]
    for _ in range(na):
        k,lock=r.u('h?'); pos=[r.u('3f') for _ in range(k)] if lock else []
        m['actions'].append((k,lock,pos))
    m['bones']=[]
    for _ in range(nb):
        dummy,=r.u('?')
        if dummy: m['bones'].append(None); continue
        nm_,par=r.u('32sh'); keys=[]
        for (k,_,_) in m['actions']:
            keys.append(([r.u('3f') for _ in range(k)],[r.u('3f') for _ in range(k)]))
        m['bones'].append((cstr(nm_),par,keys))
    m['rest']=d[r.o:]; return m
def write(m,path):
    o=bytearray(b'BMD\x0a')+struct.pack('<32s3h',m['name'].encode('latin1'),len(m['meshes']),len(m['bones']),len(m['actions']))
    for me in m['meshes']:
        o+=struct.pack('<5h',len(me['v']),len(me['n']),len(me['t']),len(me['tri']),me['tex'])
        for x in me['v']: o+=struct.pack('<hh3f',*x)
        for x in me['n']: o+=struct.pack('<hh3fhh',*x)
        for x in me['t']: o+=struct.pack('<2f',*x)
        for x in me['tri']: o+=x
        o+=struct.pack('<32s',me['texname'].encode('latin1'))
    for k,lock,pos in m['actions']:
        o+=struct.pack('<h?',k,lock)
        for p in pos: o+=struct.pack('<3f',*p)
    for b in m['bones']:
        if b is None: o+=b'\x01'; continue
        o+=struct.pack('<?32sh',False,b[0].encode('latin1'),b[1])
        for ps,rs in b[2]:
            for p in ps: o+=struct.pack('<3f',*p)
            for p in rs: o+=struct.pack('<3f',*p)
    o+=m.get('rest',b''); open(path,'wb').write(o)
def tri(vi,ni,ti):  # triangulo de 64 bytes
    b=bytearray(64); b[0]=3
    struct.pack_into('<4h',b,2,*vi,0); struct.pack_into('<4h',b,10,*ni,0); struct.pack_into('<4h',b,18,*ti,0); return bytes(b)
