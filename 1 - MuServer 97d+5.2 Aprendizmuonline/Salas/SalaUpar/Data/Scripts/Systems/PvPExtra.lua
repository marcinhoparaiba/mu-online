--[[PvP Extra (MuBanneD): sequencia de kills (so titulos), ranking PvP semanal, cacada ao PK (so aviso).
    Premios so no ranking PvP e no Mata-Mata automatico: sword, scepter, shield, kit anel+pendant e pet das linhas de EVENTO, +11, sem repetir. Offline: guarda na tabela PvPPremio e entrega no login.]]--
PvPExtra = {}
PVP_STREAK = {}          -- aIndex -> kills seguidas
PVP_STREAK_MSG = {[5] = "esta dominando!", [10] = "esta IMPARAVEL!", [25] = "e uma LENDA do PvP!", [50] = "e o DEUS DA GUERRA!"}
PVP_RANK_DIA, PVP_RANK_HORA = 1, 0   -- domingo(1) 00h: fecha o ranking semanal (top 3 premiados)

local function q(s) return (tostring(s or ""):gsub("'", "''")) end

-- O vencedor ganha 1 CREDITO (PvPPremio). Ele escolhe a categoria com /premio <categoria>; o item sai sorteado
-- daquela categoria, sem repetir ate todos da categoria terem saido (PvPSorteio guarda o que falta).
PVP_EVENTO_GRANDE = 30   -- evento com 30+ jogadores libera a categoria ASA
function PvPExtra.Categorias(comAsa)
    local c, l = {}, {}
    for _, p in ipairs(EDITOR_PREMIO or {}) do
        if not c[p[1]] and (comAsa or p[1] ~= "asa") then c[p[1]] = true; l[#l + 1] = p[1] end
    end
    table.sort(l); return l
end

-- painel na tela do vencedor (pacote 29): lista de categorias
function PvPExtra.Painel(aIndex, comAsa)
    local l = PvPExtra.Categorias(comAsa)
    local p = string.format("PremioR-%d", aIndex)
    CreatePacket(p, 29); SetBytePacket(p, #l)
    for _, c in ipairs(l) do SetBytePacket(p, c:len()); SetCharPacketLength(p, c, c:len()) end
    SendPacket(p, aIndex); ClearPacket(p)
end

function PvPExtra.Sortear(cat)
    local function tirar()
        local r = nil
        if db:exec(string.format("SELECT TOP 1 Id, Item, Item2, Item3 FROM PvPSorteio WHERE Cat = '%s' ORDER BY NEWID()", q(cat))) ~= 0 and db:fetch() ~= 100 then
            r = {db:getInt("Id"), db:getInt("Item"), db:getInt("Item2"), db:getInt("Item3")} end
        db:clear(); return r
    end
    local r = tirar()
    if not r then
        for _, p in ipairs(EDITOR_PREMIO or {}) do
            if p[1] == cat then DataBase.Query(string.format("INSERT INTO PvPSorteio (Cat, Item, Item2, Item3) VALUES ('%s', %d, %d, %d)", q(cat), p[2], p[3], p[4])) end
        end
        r = tirar()
    end
    if not r then return nil end
    DataBase.Query("DELETE FROM PvPSorteio WHERE Id = " .. r[1])
    return {r[2], r[3], r[4]}
end

function PvPExtra.Entregar(nome, motivo, comAsa)
    DataBase.Query(string.format("INSERT INTO PvPPremio (Name, Item, Motivo) VALUES ('%s', %d, '%s')", q(nome), comAsa and 1 or 0, q(motivo)))
    for n = OBJECT_START_USER, MAX_OBJECT do
        if gObjIsConnectedGP(n) == 1 and User.new(n):getName() == nome then PvPExtra.Entrar(n) break end
    end
end

function PvPExtra.Premio(aIndex, Arguments)
    local nome = User.new(aIndex):getName()
    local cat = string.lower((Arguments:gsub("^%s*/%S+%s*", "")):match("^(%S+)") or "")
    local id, comAsa = nil, false
    if db:exec(string.format("SELECT TOP 1 Id, Item FROM PvPPremio WHERE Name = '%s' ORDER BY Item DESC", q(nome))) ~= 0 and db:fetch() ~= 100 then id = db:getInt("Id"); comAsa = db:getInt("Item") == 1 end
    db:clear()
    if not id then SendMessage("[Premio] Voce nao tem premio para resgatar.", aIndex, 1) return end
    if cat == "asa" and not comAsa then cat = "" end
    local itens = cat ~= "" and PvPExtra.Sortear(cat) or nil
    if not itens then PvPExtra.Painel(aIndex, comAsa) return end
    for _, it in ipairs(itens) do
        if it > 0 and InventoryCheckSpaceByItem(aIndex, it) == 0 then
            DataBase.Query(string.format("INSERT INTO PvPSorteio (Cat, Item, Item2, Item3) VALUES ('%s', %d, %d, %d)", q(cat), itens[1], itens[2], itens[3]))
            SendMessage("[Premio] Libere espaco no inventario e tente de novo.", aIndex, 1) return
        end
    end
    DataBase.Query("DELETE FROM PvPPremio WHERE Id = " .. id)
    for _, it in ipairs(itens) do
        if it > 0 then ItemSerialCreateComplete(aIndex, 236, 0, 0, it, 11, 255, 1, 1, 7, aIndex, 63, 0, 0) end
    end
    SendMessage("[Premio] Premio (" .. cat .. ") entregue no seu inventario!", aIndex, 1)
    PvPExtra.Entrar(aIndex)  -- se tiver mais premios, o painel abre de novo
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
    local nome, n = User.new(aIndex):getName(), 0
    if db:exec(string.format("SELECT COUNT(*) AS N FROM PvPPremio WHERE Name = '%s'", q(nome))) ~= 0 and db:fetch() ~= 100 then n = db:getInt("N") end
    db:clear()
    local comAsa = false
    if n > 0 and db:exec(string.format("SELECT COUNT(*) AS N FROM PvPPremio WHERE Name = '%s' AND Item = 1", q(nome))) ~= 0 and db:fetch() ~= 100 then comAsa = db:getInt("N") > 0 end
    db:clear()
    if n > 0 then SendMessage(string.format("[Premio] Voce tem %d premio(s)! Escolha a categoria no painel.", n), aIndex, 1); PvPExtra.Painel(aIndex, comAsa) end
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
Commands.Register("/premio", PvPExtra.Premio)

return PvPExtra
