# uso: python rig.py modelo.glb ref.bmd saida.bmd prefixo
import sys,io,hashlib,itertools,numpy as np,trimesh,bmd
from scipy.spatial import cKDTree
from PIL import Image
glb,ref,out,pref=sys.argv[1:5]
m=bmd.read(ref)
def rot(a):
    x,y,z=a; cx,sx,cy,sy,cz,sz=np.cos(x),np.sin(x),np.cos(y),np.sin(y),np.cos(z),np.sin(z)
    Rx=np.array([[1,0,0],[0,cx,-sx],[0,sx,cx]]);Ry=np.array([[cy,0,sy],[0,1,0],[-sy,0,cy]]);Rz=np.array([[cz,-sz,0],[sz,cz,0],[0,0,1]])
    return Rz@Ry@Rx
W=[]
for b in m['bones']:
    if b is None: W.append(np.eye(4)); continue
    L=np.eye(4); L[:3,:3]=rot(b[2][0][1][0]); L[:3,3]=b[2][0][0][0]
    W.append((W[b[1]] if b[1]>=0 else np.eye(4))@L)
rv=[];rn=[]
for me in m['meshes']:
    for v in me['v']: rv.append((W[v[0]]@np.r_[v[2:],1])[:3]); rn.append(v[0])
rv=np.array(rv); rn=np.array(rn); lo,hi=rv.min(0),rv.max(0)
sc=trimesh.load(glb); geos=sc.dump() if hasattr(sc,'dump') else [sc]
allv=np.vstack([g.vertices for g in geos]); g_lo,g_hi=allv.min(0),allv.max(0)
tree=cKDTree(rv); rtree_pts=rv[::max(1,len(rv)//3000)]
def fit(P,perm,sg):
    q=P[:,perm]*sg; ql,qh=q.min(0),q.max(0); return (q-ql)/np.maximum(qh-ql,1e-6)*(hi-lo)+lo
best=None; samp=allv[::max(1,len(allv)//3000)]
for perm in [p for p in itertools.permutations(range(3)) if p[2]==1]:
    for sg in itertools.product([1,-1],repeat=3):
        q=fit(samp,list(perm),np.array(sg)); d=tree.query(q)[0].mean()+cKDTree(q).query(rtree_pts)[0].mean()
        if best is None or d<best[0]: best=(d,list(perm),np.array(sg))
_,perm,sg=best
import os
if os.environ.get('FORCE'): a,b=os.environ['FORCE'].split(':'); perm=[int(x) for x in a.split(',')]; sg=np.array([int(x) for x in b.split(',')])
def tx(P):
    q=P[:,perm]*sg; ql,qh=(allv[:,perm]*sg).min(0),(allv[:,perm]*sg).max(0); return (q-ql)/np.maximum(qh-ql,1e-6)*(hi-lo)+lo
texs={}; meshes=[]
def split(g):
    if len(g.vertices)<30000: return [g]
    n=len(g.faces); k=n//((len(g.vertices)//25000)+1); return [g.submesh([np.arange(i,min(i+k,n))],append=True) for i in range(0,n,k)]
geos=[p for g in geos for p in split(g)]
for g in geos:
    mat=g.visual.material; img=getattr(mat,'baseColorTexture',None) or getattr(mat,'image',None)
    key=hashlib.md5(img.tobytes()).hexdigest()
    if key not in texs:
        nm='%s%d'%(pref,len(texs)); texs[key]=nm; b=io.BytesIO()
        if img.mode=='RGBA' and np.array(img)[...,3].min()<250:
            img.save(b,'TGA'); open(out.rsplit('/',1)[0]+'/%s.OZT'%nm,'wb').write(bytes(4)+b.getvalue()); texs[key]=nm+'.tga'
        else:
            img.convert('RGB').save(b,'JPEG',quality=92); open(out.rsplit('/',1)[0]+'/%s.OZJ'%nm,'wb').write(b'\xff\xd8\xff\xe0'+bytes(20)+b.getvalue()); texs[key]=nm+'.jpg'
    wv=tx(g.vertices); node=rn[tree.query(wv)[1]]
    wn=g.vertex_normals[:,perm]*sg
    lv=[(np.linalg.inv(W[n])@np.r_[p,1])[:3] for p,n in zip(wv,node)]
    ln=[W[n][:3,:3].T@x for x,n in zip(wn,node)]
    me={'tex':len(meshes),'texname':texs[key]}
    me['v']=[(int(n),0,*map(float,p)) for p,n in zip(lv,node)]
    me['n']=[(int(n),0,*map(float,x),i,0) for i,(x,n) in enumerate(zip(ln,node))]
    me['t']=[(float(a),float(1-b)) for a,b in g.visual.uv]
    me['tri']=[bmd.tri(f,f,f) for f in g.faces.tolist()]; meshes.append(me)
m['meshes']=meshes; bmd.write(m,out)
print('ok perm',perm,sg,'erro %.1f'%best[0],'ref',np.round(lo),np.round(hi),len(texs),'tex')
