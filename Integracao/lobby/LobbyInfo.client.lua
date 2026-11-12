-- Recebe do servidor os dados do lobby (guild, PK, resets, ranking, PvP, VIP, horas, mensagem do dia). Usado pelo CharacterList.lua.
LobbyInfo = {}
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
        t[c.nome] = c
    end
    ClearPacket(PacketName)
    LOBBY_INFO = t
end
InterfaceController.ClientProtocol(LobbyInfo.Protocol)
