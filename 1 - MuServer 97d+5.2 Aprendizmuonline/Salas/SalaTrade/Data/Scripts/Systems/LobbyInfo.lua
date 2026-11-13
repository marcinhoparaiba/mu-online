--[[Lobby: manda ao cliente, para cada personagem da conta: guild (nome, funcao, simbolo), PK, resets, ranking, PvP e vida do personagem.
    Mais VIP e horas online da conta e a mensagem do dia.]]--
LobbyInfo = {}

-- Mensagem do dia (aparece no topo do lobby). Edite aqui.
LOBBY_MOTD = "Bem-vindo ao MuBanneD! Evento PvP todo dia as 21h na Arena de Lorencia."

local function txt(p, s)
    s = tostring(s or "")
    if s:len() > 200 then s = s:sub(1, 200) end
    SetBytePacket(p, s:len())
    if s:len() > 0 then SetCharPacketLength(p, s, s:len()) end
end

function LobbyInfo.Protocol(aIndex, Packet, PacketName)
    if Packet ~= 27 or PacketName ~= "LobbyInfo" then return false end
    ClearPacket(PacketName)
    LobbyInfo.Enviar(aIndex)
    return true
end

-- monta e manda os dados do lobby (chamado no login da conta, antes da tela de personagens)
function LobbyInfo.Enviar(aIndex)
    local acc = User.new(aIndex):getAccountID()
    if acc == nil or acc == "" or acc:find("'") then return true end
    local q = string.format([[SELECT c.Name AS N, ISNULL(c.PkCount,0) AS P, ISNULL(c.PkLevel,3) AS PL, ISNULL(c.ResetCount,0) AS R, ISNULL(c.MasterResetCount,0) AS MR,
        ISNULL(gm.G_Name,'') AS G, ISNULL(gm.G_Status,0) AS S, ISNULL(CONVERT(varchar(64), g.G_Mark, 2),'') AS M,
        ISNULL(c.duel_total,0) AS DU, ISNULL(c.WarKill,0) AS WK, ISNULL(c.Honra,0) AS HO, ISNULL(c.EventosTotal,0) AS EV,
        1 + (SELECT COUNT(*) FROM Character x WHERE x.MasterResetCount > c.MasterResetCount OR (x.MasterResetCount = c.MasterResetCount AND x.ResetCount > c.ResetCount)) AS RK,
        ISNULL(DATEDIFF(day, c.LDate, GETDATE()), 0) AS DIAS
        FROM Character c LEFT JOIN GuildMember gm ON gm.Name = c.Name LEFT JOIN Guild g ON g.G_Name = gm.G_Name WHERE c.AccountID = '%s']], acc)
    local lista = {}
    if db:exec(q) ~= 0 then
        while db:fetch() ~= 100 do
            lista[#lista + 1] = {db:getStr("N"), db:getInt("P"), db:getInt("PL"), db:getInt("R"), db:getInt("MR"), db:getStr("G"), db:getInt("S"), db:getStr("M"),
                db:getInt("DU"), db:getInt("WK"), db:getInt("HO"), db:getInt("EV"), db:getInt("RK"), db:getInt("DIAS")}
        end
    end
    db:clear()
    local vip, horas = 0, 0
    if db:exec(string.format("SELECT ISNULL(i.AccountLevel,0) AS V, ISNULL(s.OnlineHours,0) AS H FROM MEMB_INFO i LEFT JOIN MEMB_STAT s ON s.memb___id = i.memb___id WHERE i.memb___id = '%s'", acc)) ~= 0 then
        if db:fetch() ~= 100 then vip = db:getInt("V"); horas = db:getInt("H") end
    end
    db:clear()

    local p = string.format("LobbyInfoR-%d", aIndex)
    CreatePacket(p, 27)
    SetBytePacket(p, vip % 256)
    SetDwordPacket(p, horas)
    txt(p, LOBBY_MOTD)
    SetBytePacket(p, #lista)
    for _, c in ipairs(lista) do
        txt(p, c[1]); txt(p, c[6]); SetBytePacket(p, c[7] % 256); txt(p, c[8])
        SetDwordPacket(p, c[2]); SetBytePacket(p, c[3] % 256)
        SetDwordPacket(p, c[4]); SetDwordPacket(p, c[5])
        SetDwordPacket(p, c[9]); SetDwordPacket(p, c[10]); SetDwordPacket(p, c[11]); SetDwordPacket(p, c[12])
        SetDwordPacket(p, c[13]); SetDwordPacket(p, c[14])
    end
    SendPacket(p, aIndex)
    ClearPacket(p)
    return true
end

GameServerFunctions.GameServerProtocol(LobbyInfo.Protocol)
-- o servidor nao repassa pacotes Lua na tela de personagens: manda os dados assim que a conta loga
GameServerFunctions.MacAddressPlayer(function(aIndex, HWID)
    for _, seg in ipairs({2, 4, 7, 12}) do
        Timer.TimeOut(seg, function(i) pcall(LobbyInfo.Enviar, i) end, aIndex)
    end
end)

return LobbyInfo
