-- Painel de PREMIO (MuBanneD): o servidor abre (pacote 29) na tela do vencedor; ele escolhe a categoria e recebe um item sorteado dela.
PremioPainel = {}
local ID, W, H = 120, 300, 0
local P = {cats = {}, bt = {}}
local NOMES = {sword = "Sword", scepter = "Scepter", staff = "Staff", shield = "Shield", kit = "Kit Anel + Pendant", pet = "Pet",
    mace = "Mace", arco = "Arco / Besta", machado = "Machado", lanca = "Lanca", asa = "ASA"}
local function X(v) return (WindowGetWidth() / 2) - (W / 2) + v end
local function Y(v) return 80 + v end
local function dentro(x, y, w, h) return MousePosX() >= x and MousePosX() <= x + w and MousePosY() >= y and MousePosY() <= y + h end

function PremioPainel.Protocol(Packet, PacketName)
    if Packet ~= 29 or type(PacketName) ~= "string" or PacketName:sub(1, 7) ~= "PremioR" then return end
    local n = GetBytePacket(PacketName, -1) or 0
    P.cats = {}
    for i = 1, n do P.cats[i] = GetCharPacketLength(PacketName, -1, GetBytePacket(PacketName, -1)) end
    ClearPacket(PacketName)
    if n > 0 then UICustomInterface = ID end
end

function PremioPainel.Interface()
    if UICustomInterface ~= ID then return end
    H = 70 + #P.cats * 26
    EnableAlphaTest(); DisableAlphaBlend(); SetBlend(1)
    glColor4f(0.05, 0.04, 0.06, 0.93); DrawBar(X(0), Y(0), W, H); EndDrawBar(); EnableAlphaTest()
    SetFontType(1); SetTextBg(0, 0, 0, 0); SetTextColor(255, 210, 90, 255)
    RenderText3(X(W / 2), Y(10), "PARABENS! ESCOLHA SEU PREMIO", W, 8)
    SetTextColor(200, 200, 200, 255)
    RenderText3(X(W / 2), Y(26), "o item sai sorteado da categoria", W, 8)
    P.bt = {}
    for i, c in ipairs(P.cats) do
        local x, y = X(40), Y(44 + (i - 1) * 26)
        P.bt[i] = {x, y, W - 80, 22, c}
        DrawButton.Medium(dentro(x, y, W - 80, 22) and 1 or 0, x, y, W - 80, 22)
        if c == "asa" then SetTextColor(120, 220, 255, 255) else SetTextColor(237, 214, 161, 255) end
        RenderText3(x + (W - 80) / 2, y + 7, NOMES[c] or c, W - 80, 8)
    end
    DisableAlphaBlend()
end

function PremioPainel.UpdateMouse()
    if UICustomInterface ~= ID then return end
    DisableClickClient()
    if CheckReleasedKey(Keys.LButton) ~= 1 then return end
    for _, b in ipairs(P.bt) do
        if dentro(b[1], b[2], b[3], b[4]) then
            ResetMouseL(); UICustomInterface = 0
            SendPlayerChat("/premio " .. b[5]); return
        end
    end
end

function PremioPainel.UpdateKey()
    if UICustomInterface == ID and CheckPressedKey(Keys.Escape) ~= 0 then UICustomInterface = 0 end  -- fecha; reabre no proximo login
end

InterfaceController.ClientProtocol(PremioPainel.Protocol)
InterfaceController.MainProc(PremioPainel.Interface)
InterfaceController.UpdateMouse(PremioPainel.UpdateMouse)
InterfaceController.UpdateKey(PremioPainel.UpdateKey)
