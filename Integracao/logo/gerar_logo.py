from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
W,H=1024,512
F='C:/Windows/Fonts/'
big=ImageFont.truetype(F+'georgiab.ttf',150); sub=ImageFont.truetype(F+'georgiab.ttf',44)
def mask(txt,font,xy):
    m=Image.new('L',(W,H),0); ImageDraw.Draw(m).text(xy,txt,font=font,fill=255,anchor='mm'); return m
m1=mask('MuBanneD',big,(W//2,230))
# gradiente ouro
g=Image.new('RGB',(W,H)); d=ImageDraw.Draw(g)
for y in range(H):
    t=abs(y-200)/110; t=min(t,1)
    d.line([(0,y),(W,y)],fill=(int(255-60*t),int(225-120*t),int(120-90*t)))
out=Image.new('RGBA',(W,H),(0,0,0,0))
# brilho vermelho
glow=m1.filter(ImageFilter.MaxFilter(21)).filter(ImageFilter.GaussianBlur(18))
out.paste((200,20,10,255),(0,0),glow.point(lambda v:int(v*0.9)))
# contorno escuro
ol=m1.filter(ImageFilter.MaxFilter(11))
out.paste((25,8,4,255),(0,0),ol)
out.paste(g,(0,0),m1)
# realce
hl=ImageChops.subtract(m1,m1.transform(m1.size,Image.AFFINE,(1,0,0,0,1,4)))
out.paste((255,250,220,255),(0,0),hl.point(lambda v:v//2))
# espada horizontal e subtitulo
d2=ImageDraw.Draw(out)
d2.polygon([(150,345),(820,338),(870,345),(820,352),(150,349)],fill=(210,210,220,255),outline=(30,10,5,255))
d2.rectangle([118,330,150,364],fill=(170,120,40,255),outline=(30,10,5,255))
d2.ellipse([96,337,118,357],fill=(200,30,20,255),outline=(30,10,5,255))
s=mask('SEASON 5.2  •  PVP',sub,(W//2,410))
out.paste((25,8,4,255),(0,0),s.filter(ImageFilter.MaxFilter(7)))
out.paste((235,200,120,255),(0,0),s)
out=out.crop(out.getbbox()); out.save('logo-mubanned.png')
print(out.size)
