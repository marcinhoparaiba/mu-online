-- Recebe do servidor os dados do lobby (guild, PK, resets, ranking, PvP, VIP, horas, mensagem do dia). Usado pelo CharacterList.lua.
LobbyInfo = {}

-- guarda em arquivo para o lobby mostrar desde o login (no lobby o cliente nao recebe pacotes Lua)
LOBBY_CACHE_ARQ = "Data/Custom/LobbyCache.txt"
function LobbyCacheSalvar(t)
    local ok, f = pcall(io.open, LOBBY_CACHE_ARQ, "r")
    local linhas = {}
    if ok and f then for l in f:lines() do local n = l:match("^([^|]+)|") if n and t[n] == nil and l:sub(1,1) ~= "#" then linhas[#linhas + 1] = l end end f:close() end
    for nome, c in pairs(t) do
        if type(c) == "table" then
            linhas[#linhas + 1] = table.concat({tostring(c.nome), tostring(c.guild), tostring(math.floor(tonumber(c.status) or 0)), tostring(c.mark), tostring(math.floor(tonumber(c.pk) or 0)), tostring(math.floor(tonumber(c.pklevel) or 0)), tostring(math.floor(tonumber(c.resets) or 0)), tostring(math.floor(tonumber(c.mresets) or 0)), tostring(math.floor(tonumber(c.duelos) or 0)), tostring(math.floor(tonumber(c.warkill) or 0)), tostring(math.floor(tonumber(c.honra) or 0)), tostring(math.floor(tonumber(c.eventos) or 0)), tostring(math.floor(tonumber(c.rank) or 0)), tostring(math.floor(tonumber(c.dias) or 0))}, "|")
        end
    end
    local ok2, w = pcall(io.open, LOBBY_CACHE_ARQ, "w")
    local NL = string.char(10)
    if ok2 and w then w:write("#" .. (string.gsub(tostring(t._motd or ""), NL, " ")) .. NL); for _, l in ipairs(linhas) do w:write(l .. NL) end w:close() end
end
function LobbyInfo.Protocol(Packet, PacketName)
    if Packet ~= 27 or type(PacketName) ~= "string" or PacketName:sub(1, 10) ~= "LobbyInfoR" then return end
    local function s() local n = GetBytePacket(PacketName, -1) or 0; if n == 0 then return "" end; return GetCharPacketLength(PacketName, -1, n) or "" end
    local function b() return GetBytePacket(PacketName, -1) or 0 end
    local function d() return GetDwordPacket(PacketName, -1) or 0 end
    local t = {}
    t._vip = b(); t._horas = d(); t._motd = s()
    local n = b()
    for _ = 1, n do
        local c = {}
        c.nome = s(); c.guild = s(); c.status = b(); c.mark = s()
        c.pk = d(); c.pklevel = b(); c.resets = d(); c.mresets = d()
        c.duelos = d(); c.warkill = d(); c.honra = d(); c.eventos = d(); c.rank = d(); c.dias = d()
        for _, kk in ipairs({"status","pk","pklevel","resets","mresets","duelos","warkill","honra","eventos","rank","dias"}) do c[kk] = math.floor(tonumber(c[kk]) or 0) end
        t[c.nome] = c
    end
    ClearPacket(PacketName)
    LOBBY_INFO = t
    pcall(LobbyCacheSalvar, t)
end
InterfaceController.ClientProtocol(LobbyInfo.Protocol)
