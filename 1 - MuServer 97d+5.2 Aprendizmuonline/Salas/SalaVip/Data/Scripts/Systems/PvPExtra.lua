--[[PvP Extra (MuBanneD): kill streak, ranking PvP semanal, cacada ao PK (bounty), anuncios globais.
    Premio = 1 peca aleatoria das linhas de EVENTO (EDITOR_EXCL valor 1), +11. Offline: guarda na tabela PvPPremio e entrega no login.]]--
PvPExtra = {}
PVP_STREAK = {}          -- aIndex -> kills seguidas
PVP_STREAK_PREMIO = {[10] = true, [25] = true, [50] = true}
PVP_STREAK_MSG = {[5] = "esta dominando!", [10] = "esta IMPARAVEL!", [25] = "e uma LENDA do PvP!", [50] = "e o DEUS DA GUERRA!"}
PVP_RANK_DIA, PVP_RANK_HORA = 1, 0   -- domingo(1) 00h: fecha o ranking semanal (top 3 premiados)

local function q(s) return (tostring(s or ""):gsub("'", "''")) end

function PvPExtra.PremioAleatorio()
    local l = {}
    for it, v in pairs(EDITOR_EXCL or {}) do if v == 1 then l[#l + 1] = it end end
    if #l == 0 then return nil end
    return l[math.random(#l)]
end

function PvPExtra.Entregar(nome, motivo)
    local item = PvPExtra.PremioAleatorio()
    if not item then return end
    local idx = -1
    for n = OBJECT_START_USER, MAX_OBJECT do
        if gObjIsConnectedGP(n) == 1 and User.new(n):getName() == nome then idx = n break end
    end
    if idx >= 0 and InventoryCheckSpaceByItem(idx, item) ~= 0 then
        ItemSerialCreateComplete(idx, 236, 0, 0, item, 11, 255, 1, 1, 7, idx, 63, 0, 0)
        SendMessage("[PvP] Premio recebido: " .. motivo, idx, 1)
    else
        DataBase.Query(string.format("INSERT INTO PvPPremio (Name, Item, Motivo) VALUES ('%s', %d, '%s')", q(nome), item, q(motivo)))
    end
end

function PvPExtra.Morte(aIndex, TargetIndex)
    -- aIndex morreu, TargetIndex matou (so conta jogador x jogador)
    if TargetIndex == nil or TargetIndex < OBJECT_START_USER or aIndex < OBJECT_START_USER or aIndex == TargetIndex then return end
    local morto, assassino = User.new(aIndex), User.new(TargetIndex)
    local nm, na = morto:getName(), assassino:getName()
    -- streak do morto acaba
    if (PVP_STREAK[aIndex] or 0) >= 5 then SendMessageGlobal(string.format("[PvP] %s encerrou a sequencia de %d kills de %s!", na, PVP_STREAK[aIndex], nm), 0) end
    PVP_STREAK[aIndex] = 0
    local s = (PVP_STREAK[TargetIndex] or 0) + 1; PVP_STREAK[TargetIndex] = s
    if PVP_STREAK_MSG[s] then SendMessageGlobal(string.format("[PvP] %s %s (%d kills seguidas)", na, PVP_STREAK_MSG[s], s), 0) end
    if PVP_STREAK_PREMIO[s] then PvPExtra.Entregar(na, s .. " kills seguidas") end
    -- ranking semanal
    DataBase.Query(string.format("UPDATE Character SET KillsSemana = ISNULL(KillsSemana,0) + 1 WHERE Name = '%s'", q(na)))
    -- cacada ao PK: matar o jogador com mais PK online da premio
    if morto:getPKLevel() >= 5 then
        SendMessageGlobal(string.format("[Cacada] %s abateu o assassino %s e ganhou a recompensa!", na, nm), 0)
        PvPExtra.Entregar(na, "cacada ao PK " .. nm)
    end
end

function PvPExtra.Logout(aIndex) PVP_STREAK[aIndex] = nil end

function PvPExtra.Entrar(aIndex)
    local nome = User.new(aIndex):getName(); local itens = {}
    if db:exec(string.format("SELECT Id, Item, Motivo FROM PvPPremio WHERE Name = '%s'", q(nome))) ~= 0 then
        while db:fetch() ~= 100 do itens[#itens + 1] = {db:getInt("Id"), db:getInt("Item"), db:getStr("Motivo")} end
    end
    db:clear()
    for _, p in ipairs(itens) do
        if InventoryCheckSpaceByItem(aIndex, p[2]) == 0 then SendMessage("[PvP] Libere espaco no inventario para receber seus premios.", aIndex, 1) return end
        ItemSerialCreateComplete(aIndex, 236, 0, 0, p[2], 11, 255, 1, 1, 7, aIndex, 63, 0, 0)
        DataBase.Query("DELETE FROM PvPPremio WHERE Id = " .. p[1])
        SendMessage("[PvP] Premio entregue: " .. p[3], aIndex, 1)
    end
end

local fechado = nil
function PvPExtra.Relogio()
    local t = os.date("*t")
    if t.wday ~= PVP_RANK_DIA or t.hour ~= PVP_RANK_HORA then fechado = nil return end
    if fechado then return end
    fechado = true
    local top = {}
    if db:exec("SELECT TOP 3 Name, KillsSemana FROM Character WHERE ISNULL(KillsSemana,0) > 0 ORDER BY KillsSemana DESC") ~= 0 then
        while db:fetch() ~= 100 do top[#top + 1] = {db:getStr("Name"), db:getInt("KillsSemana")} end
    end
    db:clear()
    for i, c in ipairs(top) do
        SendMessageGlobal(string.format("[Ranking PvP] %do lugar da semana: %s com %d kills!", i, c[1], c[2]), 0)
        PvPExtra.Entregar(c[1], i .. "o lugar do Ranking PvP semanal")
    end
    DataBase.Query("UPDATE Character SET KillsTotal = ISNULL(KillsTotal,0) + ISNULL(KillsSemana,0), KillsSemana = 0")
end

GameServerFunctions.PlayerDie(PvPExtra.Morte)
GameServerFunctions.PlayerLogout(PvPExtra.Logout)
GameServerFunctions.EnterCharacter(PvPExtra.Entrar)
Timer.Interval(60, PvPExtra.Relogio)

return PvPExtra
