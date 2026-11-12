--[[PvP Extra (MuBanneD): sequencia de kills (so titulos), ranking PvP semanal, cacada ao PK (so aviso).
    Premios so no ranking PvP e no Mata-Mata automatico: sword, scepter, shield, kit anel+pendant e pet das linhas de EVENTO, +11, sem repetir. Offline: guarda na tabela PvPPremio e entrega no login.]]--
PvPExtra = {}
PVP_STREAK = {}          -- aIndex -> kills seguidas
PVP_STREAK_MSG = {[5] = "esta dominando!", [10] = "esta IMPARAVEL!", [25] = "e uma LENDA do PvP!", [50] = "e o DEUS DA GUERRA!"}
PVP_RANK_DIA, PVP_RANK_HORA = 1, 0   -- domingo(1) 00h: fecha o ranking semanal (top 3 premiados)

local function q(s) return (tostring(s or ""):gsub("'", "''")) end

-- sorteio sem repetir: tira de PvPSorteio; quando acaba, enche de novo com todos os premios (EDITOR_PREMIO)
function PvPExtra.Sortear()
    local function tirar()
        local r = nil
        if db:exec("SELECT TOP 1 Id, Item, Item2 FROM PvPSorteio ORDER BY NEWID()") ~= 0 and db:fetch() ~= 100 then r = {db:getInt("Id"), db:getInt("Item"), db:getInt("Item2")} end
        db:clear(); return r
    end
    local r = tirar()
    if not r then
        for _, p in ipairs(EDITOR_PREMIO or {}) do DataBase.Query(string.format("INSERT INTO PvPSorteio (Item, Item2) VALUES (%d, %d)", p[1], p[2])) end
        r = tirar()
    end
    if not r then return nil end
    DataBase.Query("DELETE FROM PvPSorteio WHERE Id = " .. r[1])
    return r[2], r[3]
end

function PvPExtra.Entregar(nome, motivo)
    local a, b = PvPExtra.Sortear()
    if not a then return end
    for _, item in ipairs({a, b}) do
        if item and item > 0 then DataBase.Query(string.format("INSERT INTO PvPPremio (Name, Item, Motivo) VALUES ('%s', %d, '%s')", q(nome), item, q(motivo))) end
    end
    for n = OBJECT_START_USER, MAX_OBJECT do  -- online: entrega na hora
        if gObjIsConnectedGP(n) == 1 and User.new(n):getName() == nome then PvPExtra.Entrar(n) break end
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
    -- ranking semanal
    DataBase.Query(string.format("UPDATE Character SET KillsSemana = ISNULL(KillsSemana,0) + 1 WHERE Name = '%s'", q(na)))
    -- cacada ao PK: matar o jogador com mais PK online da premio
    if morto:getPKLevel() >= 5 then
        SendMessageGlobal(string.format("[Cacada] %s abateu o assassino %s!", na, nm), 0)
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
