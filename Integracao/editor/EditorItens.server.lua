--[[Editor de Itens (MuBanneD), tecla D no cliente.
    /editor secao index nivel   e   /editorset index pecas nivel   (opcoes sempre no maximo; gratis)
    Exclusivos: valor 1 = EVENTOS (GM e ADM), 2 = DONATE (so a conta ADM).
    GM precisa justificar: o item fica pendente ate /justificar <texto> (min. 10 letras, 2 min). Tudo fica no banco (EditorLog).]]--
EditorItens = {}

EDITOR_DONO = "admin"            -- conta ADM: acesso a tudo
EDITOR_EXCL = {--EXCL--}         -- GET_ITEM -> 1 evento / 2 donate
EDITOR_SETEXCL = {--SETEXCL--}   -- index do set -> 1 evento / 2 donate
EDITOR_PREMIO = {--PREMIO--} -- premios automaticos {item, item2 do kit (0 = nenhum)}
EDITOR_VALIDOS = {--VALIDOS--}   -- itens que existem no Item.txt
EDITOR_SETMASK = {--SETMASK--}   -- pecas que existem em cada set (bits)
local PENDENTE = {}              -- aIndex -> pedido do GM aguardando justificativa

-- 0 jogador, 1 GM, 2 ADM
function EditorItens.Perm(aIndex)
    local p = User.new(aIndex)
    if p:getAccountID() == EDITOR_DONO then return 2 end
    if p:getAuthority() >= 32 then return 1 end
    return 0
end

local function sql(s) return (tostring(s or ""):gsub("'", "''")) end

local function registrar(aIndex, desc, just)
    local p = User.new(aIndex)
    DataBase.Query(string.format("INSERT INTO EditorLog (Data, Conta, Personagem, Item, Justificativa) VALUES (GETDATE(), '%s', '%s', '%s', '%s')",
        sql(p:getAccountID()), sql(p:getName()), sql(desc), sql(just)))
end

local function criar(aIndex, ped)
    local sk, lu, op, ex = 1, 1, 7, 63
    if ped.secao and ped.secao >= 14 then sk, lu, op, ex = 0, 0, 0, 0 end
    for _, it in ipairs(ped.itens) do
        ItemSerialCreateComplete(aIndex, 236, 0, 0, it, ped.lv, (ped.secao == 14) and 1 or 255, sk, lu, op, aIndex, ex, 0, 0)
    end
    SendMessage(string.format("[Editor] %s criado no seu inventario!", ped.desc), aIndex, 1)
end

-- decide: cria na hora, nega, ou pede justificativa (GM)
local function pedir(aIndex, nivelExcl, ped)
    local perm = EditorItens.Perm(aIndex)
    if nivelExcl == 2 and perm < 2 then SendMessage("[Editor] Item de DONATE: so a conta ADM.", aIndex, 1) return end
    if nivelExcl == 1 and perm < 1 then SendMessage("[Editor] Item exclusivo.", aIndex, 1) return end
    if nivelExcl >= 1 and perm == 1 then
        ped.hora = os.time(); PENDENTE[aIndex] = ped
        SendMessage("[Editor] Justificativa obrigatoria. Digite: /justificar motivo (ex: premio do mata-mata 12/11 21h)", aIndex, 1)
        return
    end
    criar(aIndex, ped)
    if nivelExcl >= 1 then registrar(aIndex, ped.desc, "ADM") end
end

function EditorItens.Comprar(aIndex, Arguments)
    local s = command:getNumber(Arguments, 1)
    local i = command:getNumber(Arguments, 2)
    local lv = math.max(0, math.min(15, command:getNumber(Arguments, 3)))
    if s < 0 or s > 15 or i < 0 or i > 511 or not EDITOR_VALIDOS[GET_ITEM(s, i)] then SendMessage("[Editor] Item invalido.", aIndex, 1) return end
    local item = GET_ITEM(s, i)
    if InventoryCheckSpaceByItem(aIndex, item) == 0 then SendMessage("[Editor] Sem espaco no inventario.", aIndex, 1) return end
    pedir(aIndex, EDITOR_EXCL[item] or 0, {itens = {item}, lv = lv, secao = s, desc = string.format("Item %d:%d +%d", s, i, lv)})
end

-- /editorset index pecas(bits: 1 elmo,2 armadura,4 calca,8 luva,16 bota) nivel
function EditorItens.ComprarSet(aIndex, Arguments)
    local i = command:getNumber(Arguments, 1)
    local mk = command:getNumber(Arguments, 2)
    local lv = math.max(0, math.min(15, command:getNumber(Arguments, 3)))
    if i < 0 or i > 511 then SendMessage("[Editor] Set invalido.", aIndex, 1) return end
    local ok, itens = EDITOR_SETMASK[i] or 0, {}
    for s = 7, 11 do
        local b = 2 ^ (s - 7)
        if math.floor(mk / b) % 2 == 1 and math.floor(ok / b) % 2 == 1 then itens[#itens + 1] = GET_ITEM(s, i) end
    end
    if #itens == 0 then SendMessage("[Editor] Set invalido.", aIndex, 1) return end
    for _, it in ipairs(itens) do
        if InventoryCheckSpaceByItem(aIndex, it) == 0 then SendMessage("[Editor] Sem espaco no inventario para o set.", aIndex, 1) return end
    end
    pedir(aIndex, EDITOR_SETEXCL[i] or 0, {itens = itens, lv = lv, secao = 7, desc = string.format("Set %d (%d pecas) +%d", i, #itens, lv)})
end

function EditorItens.Justificar(aIndex, Arguments)
    local ped = PENDENTE[aIndex]
    if not ped then SendMessage("[Editor] Nenhum item aguardando justificativa.", aIndex, 1) return end
    if os.time() - ped.hora > 120 then PENDENTE[aIndex] = nil; SendMessage("[Editor] Tempo esgotado. Peca o item de novo.", aIndex, 1) return end
    local texto = Arguments:gsub("^%s*/%S+%s*", "")
    if texto:len() < 10 then SendMessage("[Editor] Justificativa muito curta (minimo 10 letras).", aIndex, 1) return end
    for _, it in ipairs(ped.itens) do
        if InventoryCheckSpaceByItem(aIndex, it) == 0 then SendMessage("[Editor] Sem espaco no inventario.", aIndex, 1) return end
    end
    PENDENTE[aIndex] = nil
    criar(aIndex, ped)
    registrar(aIndex, ped.desc, texto:sub(1, 200))
end

-- o cliente pergunta a permissao ao abrir o editor (pacote 28): responde 0/1/2
function EditorItens.Protocol(aIndex, Packet, PacketName)
    if Packet ~= 28 or PacketName ~= "EditorPerm" then return false end
    ClearPacket(PacketName)
    local p = string.format("EditorPermR-%d", aIndex)
    CreatePacket(p, 28); SetBytePacket(p, EditorItens.Perm(aIndex)); SendPacket(p, aIndex); ClearPacket(p)
    return true
end

Commands.Register("/editor", EditorItens.Comprar)
Commands.Register("/editorset", EditorItens.ComprarSet)
Commands.Register("/justificar", EditorItens.Justificar)
GameServerFunctions.GameServerProtocol(EditorItens.Protocol)

return EditorItens
