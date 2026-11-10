# uso: python glb2bmd.py modelo.glb modelo_ref.bmd saida.bmd prefixo_textura comprimento eixo_ref(0/1/2) [centro_cabo]
import hashlib,sys,io,copy,trimesh,numpy as np,bmd
from PIL import Image
glb,ref,out,pref,comp,eixo=sys.argv[1:7]; m0=__import__('bmd').read(ref); _v=[v[2:] for x in m0['meshes'] for v in x['v']]; _e=[max(c[i] for c in _v)-min(c[i] for c in _v) for i in range(3)]
comp=float(comp) if comp!='auto' else max(_e)*1.25; eixo=int(eixo) if eixo!='auto' else _e.index(max(_e))
cabo=float(sys.argv[7]) if len(sys.argv)>7 else None
m=bmd.read(ref); sc=trimesh.load(glb)
geos=[g for g in sc.dump()] if hasattr(sc,'dump') else [sc]
allv=np.vstack([g.vertices for g in geos]); lo,hi=allv.min(0),allv.max(0)
L=np.argmax(hi-lo); k=comp/(hi[L]-lo[L]); c=(lo+hi)/2; 
if cabo is not None: c[L]=cabo
outdir=out.rsplit('/',1)[0] if '/' in out else '.'
texs={}; meshes=[]
for g in geos:
    img=g.visual.material.baseColorTexture if hasattr(g.visual.material,'baseColorTexture') else g.visual.material.image
    key=hashlib.md5(img.tobytes()).hexdigest()
    if key not in texs:
        nm='%s%d'%(pref,len(texs)); texs[key]=nm
        b=io.BytesIO(); img.convert('RGB').save(b,'JPEG',quality=92); open('%s/%s.OZJ'%(outdir,nm),'wb').write(b'\xff\xd8\xff\xe0'+bytes(20)+b.getvalue())
    v=(g.vertices-c)*k
    # eixo longo do GLB -> eixo do modelo de referencia; demais mantem ordem
    o=[i for i in range(3) if i!=L]; t=[i for i in range(3) if i!=eixo]; nv=np.zeros_like(v); nv[:,eixo]=v[:,L]; nv[:,t[0]]=v[:,o[0]]; nv[:,t[1]]=v[:,o[1]]
    nn=np.zeros_like(nv); vn=g.vertex_normals; nn[:,eixo]=vn[:,L]; nn[:,t[0]]=vn[:,o[0]]; nn[:,t[1]]=vn[:,o[1]]
    uv=g.visual.uv
    me={'tex':len(meshes),'texname':texs[key]+'.jpg'}
    me['v']=[(0,0,*map(float,p)) for p in nv]; me['n']=[(0,0,*map(float,p),i,0) for i,p in enumerate(nn)]
    me['t']=[(float(a),float(1-b)) for a,b in uv]
    me['tri']=[bmd.tri(f,f,f) for f in g.faces.tolist()]; meshes.append(me)
m['meshes']=meshes; m['name']=pref; bmd.write(m,out)
print(len(meshes),'meshes', len(texs),'texturas', sum(len(x['v']) for x in meshes),'vertices')
