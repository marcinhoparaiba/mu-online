-- EDITOR DE ITENS (MuBanneD): tecla Z abre. Escolhe categoria, item, [editar], opcoes e COMPRAR (cobra cash no servidor).
EditorItens = {}
EDITOR_ITENS = {--ITENS--}
EDITOR_LINHAS = {--LINHAS--}
local NDON = --NDON-- -- as primeiras NDON linhas sao DONATE, o resto EVENTOS/RANKING -- linhas exclusivas (ALL completo de cada tema)
local CAT = {[0]="Espadas","Machados","Macas/Cetros","Lancas","Arcos/Bestas","Cajados","Escudos","Elmos","Armaduras","Calcas","Luvas","Botas","Asas/Capas","Pets/Aneis","Pocoes/Joias","Pergaminhos","ALL (sets)"}
EDITOR_PERM = 0 -- 0 jogador, 1 GM (so EVENTOS), 2 ADM (EVENTOS e DONATE); vem do servidor (pacote 28)
local EXC = {"Mana/kill","Vida/kill","Vel. ataque","Dano +2%","Dano +lv/20","Dano exc"}
local BASE = {[0]=100,100,100,100,100,100,80,80,100,80,80,80,300,200,10,50}
local ANC = {0,5,9}
local W, H, ID, POR = 560, 400, 119, 20
local COL, CW, CH = 5, 44, 74  -- grade da loja: 5 colunas x 4 linhas, celula 44x74
local E = {cat=0, page=0, sel=nil, lv=0, op=7, sk=1, lu=1, ex=63, an=1, lista={}, bt={}, exc=false, grp=1}

local function inside(x,y,w,h) return MousePosX()>=x and MousePosX()<=x+w and MousePosY()>=y and MousePosY()<=y+h end
local function X(v) return (WindowGetWidth()/2)-(W/2)+v end
local function Y(v) return (WindowGetHeight()/2)-(H/2)-30+v end
local function cel(r) local k=r-1; return X(142+(k%COL)*CW), Y(36+math.floor(k/COL)*CH) end

local function preco()
    if not E.sel then return 0 end
    local n, base = 1, (BASE[E.sel[1]] or 100)
    if E.sel[1]==16 then n=0; base=0; for s=7,11 do if math.floor(E.sel[5]/(2^(s-7)))%2==1 then n=n+1; base=base+BASE[s] end end end
    local p = E.lv*10 + E.op*10 + E.sk*20 + E.lu*20
    for b=0,5 do if math.floor(E.ex/(2^b))%2==1 then p=p+50 end end
    if ANC[E.an] ~= 0 then p=p+100 end
    return base + p*n
end

local function filtra()
    E.lista = {}
    for _,it in ipairs(EDITOR_ITENS) do if (E.exc and it.L==E.cat+1) or (not E.exc and it[4]~=1 and it[1]==E.cat) then E.lista[#E.lista+1]=it end end
end

-- botoes: {x,y,w,h,texto,acao,ligado}
local function monta()
    local b = {}
    b[#b+1] = {X(W-34),Y(8),26,20,"X",function() EditorItens.Close() end}
    if EDITOR_PERM == 1 then E.grp = 2 end
    if EDITOR_PERM >= 1 then b[#b+1] = {X(10),Y(8),120,20,E.exc and "< LOJA NORMAL" or "EXCLUSIVOS",function() E.exc=not E.exc; E.cat=(EDITOR_PERM==1) and NDON or 0; E.grp=(EDITOR_PERM==1) and 2 or 1; E.page=0; E.sel=nil; filtra() end, E.exc} end
    if E.exc then
        if EDITOR_PERM >= 2 then b[#b+1] = {X(10),Y(36),58,17,"DONATE",function() E.grp=1; E.cat=0; E.page=0; filtra() end, E.grp==1} end
        b[#b+1] = {X(72),Y(36),58,17,"EVENTOS",function() E.grp=2; E.cat=NDON; E.page=0; filtra() end, E.grp==2}
        local c0, c1 = 0, NDON-1
        if E.grp==2 then c0, c1 = NDON, #EDITOR_LINHAS-1 end
        for c=c0,c1 do b[#b+1] = {X(10),Y(58+(c-c0)*15),120,14,EDITOR_LINHAS[c+1],function() E.cat=c; E.page=0; filtra() end, E.cat==c} end
    else
        for c=0,16 do b[#b+1] = {X(10),Y(36+c*19),120,17,CAT[c],function() E.cat=c; E.page=0; filtra() end, E.cat==c} end
    end
    local ini = E.page*POR
    for r=1,POR do
        local it = E.lista[ini+r]
        if it then local cx,cy = cel(r); b[#b+1] = {cx,cy,CW-2,CH-2,"",function() E.sel=it end, E.sel==it, it} end
    end
    local np = math.max(1, math.ceil(#E.lista/POR))
    b[#b+1] = {X(140),Y(342),40,20,"<",function() if E.page>0 then E.page=E.page-1 end end}
    b[#b+1] = {X(318),Y(342),40,20,">",function() if E.page<np-1 then E.page=E.page+1 end end}
    if E.sel then
        local px = X(372)
        b[#b+1] = {px+60,Y(60),24,19,"-",function() if E.lv>0 then E.lv=E.lv-1 end end}
        b[#b+1] = {px+150,Y(60),24,19,"+",function() if E.lv<15 then E.lv=E.lv+1 end end}
        b[#b+1] = {px,Y(110),84,19,"Skill",function() end, true}
        b[#b+1] = {px+90,Y(110),84,19,"Luck",function() end, true}
        for k=0,5 do
            local bit = 2^k
            b[#b+1] = {px+(k%2)*90,Y(136+math.floor(k/2)*23),84,19,EXC[k+1],function() end, true}
        end
        b[#b+1] = {px,Y(300),174,26,"EDITAR ITEM",function()
            if E.sel[1]==16 then
                SendPlayerChat(string.format("/editorset %d %d %d %d %d %d %d %d", E.sel[2], E.sel[5], E.lv, E.sk, E.lu, E.op, E.ex, ANC[E.an]))
            else
                SendPlayerChat(string.format("/editor %d %d %d %d %d %d %d %d", E.sel[1], E.sel[2], E.lv, E.sk, E.lu, E.op, E.ex, ANC[E.an]))
            end
        end}
    end
    E.bt = b
end

local function texto(x,y,t,w,r,g,bl)
    SetFontType(1); SetTextBg(0,0,0,0); SetTextColor(r or 255,g or 255,bl or 255,255)
    RenderText3(x,y,t,w,8)
end

function EditorItens.Open()
    E.cat=E.cat or 0; filtra(); UICustomInterface = ID
    if CreatePacket then CreatePacket("EditorPerm", 28); SendPacket("EditorPerm"); ClearPacket("EditorPerm") end
end
function EditorItens.Protocol(Packet, PacketName)
    if Packet ~= 28 or type(PacketName) ~= "string" or PacketName:sub(1, 11) ~= "EditorPermR" then return end
    EDITOR_PERM = GetBytePacket(PacketName, -1) or 0; ClearPacket(PacketName)
    if EDITOR_PERM == 0 then E.exc = false end
end
InterfaceController.ClientProtocol(EditorItens.Protocol)
function EditorItens.Close() UICustomInterface = 0 end
function EditorItens.IsOpen() return UICustomInterface == ID end

function EditorItens.Interface()
    if not EditorItens.IsOpen() then return end
    monta()
    EnableAlphaTest(); DisableAlphaBlend(); SetBlend(1)
    glColor4f(0.05,0.05,0.07,0.92); DrawBar(X(0),Y(0),W,H)
    glColor4f(0,0,0,0.5); DrawBar(X(140),Y(32),220,334); DrawBar(X(366),Y(32),186,334)
    EndDrawBar(); EnableAlphaTest()
    texto(X(W/2),Y(10),E.exc and "EDITOR DE ITENS - EXCLUSIVOS" or "EDITOR DE ITENS",260,237,214,161)
    local dica
    for _,b in ipairs(E.bt) do
        if b[8] then -- celula da loja com o item
            SetBlend(1); glColor4f(b[7] and 0.45 or 0.15, b[7] and 0.35 or 0.15, b[7] and 0.05 or 0.18, 0.8)
            DrawBar(b[1],b[2],b[3],b[4]); EndDrawBar(); EnableAlphaTest()
            CreateItem(b[1]+2, b[2]+4, b[3]-4, b[4]-8, GET_ITEM(b[8][6] or b[8][1],b[8][2]), 0, 0, 0, 1)
            if inside(b[1],b[2],b[3],b[4]) then dica = b end
        else
            DrawButton.Medium(b[7] and 2 or (inside(b[1],b[2],b[3],b[4]) and 1 or 0), b[1], b[2], b[3], b[4])
            texto(b[1]+b[3]/2, b[2]+b[4]/2-4, b[5], b[3], b[7] and 255 or 237, b[7] and 220 or 214, b[7] and 90 or 161)
        end
    end
    if dica then DrawTooltip(dica[1]+dica[3]/2, dica[2]-12, dica[8][3]) end
    texto(X(249),Y(347),string.format("pagina %d/%d", E.page+1, math.max(1, math.ceil(#E.lista/POR))),120)
    if E.sel then
        local px = X(372)
        texto(px+87,Y(40),E.sel[3],174,255,220,90)
        CreateItem(px+60, Y(232), 54, 34, GET_ITEM(E.sel[6] or E.sel[1],E.sel[2]), E.lv, E.ex, ANC[E.an], 1)
        texto(px+30,Y(64),"Nivel",60); texto(px+117,Y(64),"+"..E.lv,60)
        texto(px+30,Y(88),"Adic.",60); texto(px+117,Y(88),"+28 (max)",80)
        texto(px+87,Y(212),"Opcoes ja no maximo",174,160,160,170)

    else
        texto(X(459),Y(150),"Clique num item",174)
        texto(X(459),Y(166),"para editar",174)
    end
    DisableAlphaBlend()
end

function EditorItens.UpdateMouse()
    if not EditorItens.IsOpen() then return end
    DisableClickClient()
    if CheckReleasedKey(Keys.LButton) ~= 1 then return end
    for _,b in ipairs(E.bt) do
        if inside(b[1],b[2],b[3],b[4]) then ResetMouseL(); b[6](); return end
    end
end

function EditorItens.UpdateKey()
    if UICustomInterface ~= 0 and UICustomInterface ~= ID then return end
    if CheckWindowOpen(UIChatWindow) ~= 0 then return end
    if CheckPressedKey(Keys.Escape) ~= 0 and EditorItens.IsOpen() then DisableClickClient(); EditorItens.Close(); return end
    -- Z abre o editor; o D fica com o menu de comandos nativo (Trade, Party, Guild, Duel...)
    if CheckPressedKey(Keys.Z) ~= 0 then
        DisableClickClient()
        if EditorItens.IsOpen() then EditorItens.Close() else EditorItens.Open() end
    end
end

InterfaceController.MainProc(EditorItens.Interface)
InterfaceController.UpdateMouse(EditorItens.UpdateMouse)
InterfaceController.UpdateKey(EditorItens.UpdateKey)
