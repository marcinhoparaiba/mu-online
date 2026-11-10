import bmd,struct,sys,shutil,os
def weld(path,bk):
    m=bmd.read(path)
    os.makedirs(bk,exist_ok=True); b0=os.path.join(bk,os.path.basename(path))
    if not os.path.exists(b0): shutil.copy2(path,os.path.join(bk,os.path.basename(path)))
    for me in m['meshes']:
        vm,vl,vk={},[],{}
        for i,v in enumerate(me['v']):
            k=(v[0],)+tuple(round(x,4) for x in v[2:]); vm[i]=vk.setdefault(k,len(vl)) if k in vk else (vl.append(v) or vk.setdefault(k,len(vl)-1))
        nm,nl,nk={},[],{}
        for i,n in enumerate(me['n']):
            n2=(n[0],n[1],n[2],n[3],n[4],vm.get(n[5],0),n[6]); k=(n2[0],n2[5])
            if k not in nk: nk[k]=len(nl); nl.append(n2)
            nm[i]=nk[k]
        tm,tl,tk={},[],{}
        for i,t in enumerate(me['t']):
            k=tuple(round(x,5) for x in t)
            if k not in tk: tk[k]=len(tl); tl.append(t)
            tm[i]=tk[k]
        tris=[]
        for tr in me['tri']:
            b=bytearray(tr); s=struct.unpack_from('<12h',b,2)
            s=[vm.get(x,x) for x in s[0:4]]+[nm.get(x,x) for x in s[4:8]]+[tm.get(x,x) for x in s[8:12]]
            struct.pack_into('<12h',b,2,*s); tris.append(bytes(b))
        print(os.path.basename(path),len(me['v']),'->',len(vl),len(me['n']),'->',len(nl),len(me['t']),'->',len(tl))
        me['v'],me['n'],me['t'],me['tri']=vl,nl,tl,tris
    bmd.write(m,path)
for p in sys.argv[2:]: weld(p,sys.argv[1])
