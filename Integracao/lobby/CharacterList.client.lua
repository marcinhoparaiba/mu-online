LOBBY_Z = 200.0 -- altura dos personagens no lobby
OpenFolder("Definitions")

local MAX_CHARACTER_LIST = 4  -- max character list if you want 5 set 5, i not recommend minus 5, the max of the system is 10 if you try put more you can't

local MOUNT_ADD_SIZE = -0.70    -- Add size in mount pet
local FLYING_ADD_SIZE = -0.30   -- Add size in flying pet
local FLYING_ADD_HEIGHT = 80.0 -- Add height in flying pet

local Button1Index = -1
local Button2Index = -1
local Button3Index = -1

CHARACTER_LIST_MESSAGES = {}

CHARACTER_LIST_MESSAGES['Por'] = {
	[1] = 'Sem personagem',
}

CHARACTER_LIST_MESSAGES['Eng'] = {
	[1] = 'Empty character',
}

CHARACTER_LIST_MESSAGES['Spn'] = {
	[1] = 'Sin personaje'
}

function StartLoadImages()
	Button1Index = LoadImageByDir("Custom///Interface///CharacterSelect_Button01.tga")
	Button2Index = LoadImageByDir("Custom///Interface///CharacterSelect_Button02.tga")
	Button3Index = LoadImageByDir("Custom///Interface///CharacterSelect_Button03.tga")
end

-- Lobby: 6 personagens lado a lado; o selecionado fica maior (efeito de aproximar)
function LobbyPosX(index)
	return 8590.0
end

-- CARROSSEL: o personagem escolhido fica sempre no centro (a camera nao se move); os outros giram em volta
LOBBY_CUR = {}
local function LobbyVivos()
	local v = {}
	for i = 0, (MAX_CHARACTER_LIST - 1) do
		if CharacterGetIsLive(i) == 1 then v[#v + 1] = i end
	end
	return v
end

function LobbyPosY(index)
	local v = LobbyVivos()
	local n = #v
	if n < 1 then return 18570.0 end
	local sel = GetSelectedHero()
	local ps, pi = nil, nil
	for k, i in ipairs(v) do
		if i == sel then ps = k end
		if i == index then pi = k end
	end
	if pi == nil then return 18570.0 end
	if ps == nil then ps = math.floor((n - 1) / 2) + 1 end
	local rel = pi - ps
	local meio = math.floor(n / 2)
	if rel > meio then rel = rel - n end
	if rel < -(n - 1 - meio) then rel = rel + n end
	return 18570.0 + rel * 500.0
end

-- desliza suave ate a posicao do carrossel
function LobbyAnima()
	for i = 0, (MAX_CHARACTER_LIST - 1) do
		if CharacterGetIsLive(i) == 1 then
			local alvo = LobbyPosY(i)
			local cur = LOBBY_CUR[i] or alvo
			if math.abs(alvo - cur) > 900.0 then cur = alvo end -- quem da a volta pula direto para o outro lado
			if i == GetSelectedHero() then cur = alvo end -- o escolhido vai direto ao centro: a camera (que segue ele) nao se mexe
			cur = cur + (alvo - cur) * 0.18
			LOBBY_CUR[i] = cur
			CharacterSetPositionX(i, LobbyPosX(i))
			CharacterSetPositionY(i, cur)
		end
	end
end

function LobbyCentro()
	local sel = GetSelectedHero()
	if sel ~= nil and sel >= 0 and CharacterGetIsLive(sel) == 1 then return sel end
	local v = LobbyVivos()
	if #v < 1 then return 0 end
	return v[math.floor((#v - 1) / 2) + 1]
end

function SetCharacterPosition(index)
	CharacterSetPositionX(index, LobbyPosX(index))
	CharacterSetPositionY(index, LobbyPosY(index))
	CharacterSetPositionZ(index, LOBBY_Z)
	CharacterSetAngleZ(index, 75.0)
	CharacterSetScale(index, 1.0)
end

function SetCharacterScale(index)
	if GetSelectedHero() == index
	then
		CharacterSetScale(index, 1.0)
	else
		CharacterSetScale(index, 1.0)
	end
end

function CharacterRotate(index)
	CharacterSetAngleZ(index, CharacterGetAngleZ(index) + 5.0)
end

local SelectedButton = -1
local ClickedButton = -1

function UpdateProc(maxCharacter)
	if CheckCreateCharacterWindow() ~= 0
	then
		return
	end

	SelectedButton = -1
	ClickedButton = -1

	addY = 0.0

	local frame_cx = (2 * GetWideX())

	for i = 0, (maxCharacter - 1) do
		if (MousePosX() >= 470 + frame_cx and MousePosX() <= 470 + 150 + frame_cx)
			and (MousePosY() >= (50 + addY) and MousePosY() <= (50 + addY + 35))
		then
			SelectedButton = i

			if CheckRepeatKey(Keys.LButton) == 1
			then
				CharacterRotate(i)
			end

			if (CheckClickClient() == 1)
			then
				if (CharacterGetIsLive(i) == 1)
				then
					ClickedButton = i

					--Set action in character
					SetCharacterAction(i, 207)

					SetSelectedHero(i)
					SetTargetCharacter(i)

					DisableClickClient()
				end
			end
		end

		addY = addY + 37.0
	end
end

function GetGuildType(index)
	local GuildStatus = CharacterGetGuildStatus(index)
	local TextIndex = 488

	if GuildStatus == 0
	then
		TextIndex = 1330
	elseif GuildStatus == 32
	then
		TextIndex = 1302
	elseif GuildStatus == 64
	then
		TextIndex = 1301
	elseif GuildStatus == 128
	then
		TextIndex = 1300
	end

	return GetGlobalText(TextIndex)
end

-- cores do simbolo de guild do MU (16 cores, 0 = transparente)
local MARK_COR = {[1]={0,0,0},[2]={128,128,128},[3]={255,255,255},[4]={255,0,0},[5]={255,128,0},[6]={255,255,0},[7]={128,255,0},[8]={0,255,0},
	[9]={0,255,128},[10]={0,255,255},[11]={0,128,255},[12]={0,0,255},[13]={128,0,255},[14]={255,0,255},[15]={255,0,128}}
local FUNCAO = {[0]="Membro", [32]="Battle Master", [64]="Assistente", [128]="Guild Master"}

local function RenderMark(x, y, hex, px)
	-- desenha o simbolo 8x8 com o fundo do texto (DrawBar fechava o jogo no lobby)
	if type(hex) ~= "string" or hex:len() < 64 then return end
	for row = 0, 7 do
		for col = 0, 7 do
			local p = row * 8 + col
			local byte = tonumber(hex:sub(math.floor(p / 2) * 2 + 1, math.floor(p / 2) * 2 + 2), 16) or 0
			local c = (p % 2 == 0) and math.floor(byte / 16) or (byte % 16)
			local cor = MARK_COR[c]
			if cor then
				SetTextBg(cor[1], cor[2], cor[3], 255)
				RenderText3(x + col * px, y + row * px, " ", px, 0)
			end
		end
	end
	SetTextBg(0, 0, 0, 0)
end

-- PATENTE pelo total de resets (master reset vale 100): titulo e cor da faixa
LOBBY_PATENTES = {
	{0, "Recruta", {90, 90, 90}}, {10, "Soldado", {40, 110, 40}}, {50, "Cavaleiro", {30, 80, 170}},
	{100, "General", {150, 20, 20}}, {200, "Lenda", {140, 30, 160}}, {300, "Mito", {200, 140, 0}},
}
local function Patente(c)
	local tot = (c.resets or 0) + (c.mresets or 0) * 100
	local p = LOBBY_PATENTES[1]
	for _, x in ipairs(LOBBY_PATENTES) do if tot >= x[1] then p = x end end
	return p
end
-- cor do nome pelo status de PK (1-2 heroi, 3 normal, 4+ PK)
local function CorPk(c)
	local l = c and c.pklevel or 3
	if l <= 2 then return 120, 170, 255, 255 end
	if l == 4 then return 255, 140, 60, 255 end
	if l >= 5 then return 255, 50, 50, 255 end
	return 255, 200, 60, 255
end

-- botoes da direita: nome e resets
function RenderCharacterStatus(posX, posY, index)
	local nome = CharacterGetName(index)
	local c = LOBBY_INFO and LOBBY_INFO[nome] or nil
	SetTextColor(CorPk(c))
	RenderText3(posX + 10, posY - 3, nome, 150, 0)
	SetTextColor(255, 255, 255, 255)
	RenderText3(posX + 142, posY - 3, "Lv " .. math.floor(CharacterGetLevel(index)), 150, 7)
	if c then
		SetTextColor(200, 200, 200, 255)
		RenderText3(posX + 10, posY + 10, string.format("Resets %d  |  MR %d", c.resets, c.mresets), 150, 0)
	end
end

-- AJUSTE DE TELA das caixas em cima dos personagens (calibrar com print)
LOBBY_SLOT_DX = 200     -- distancia em pixels entre um personagem e outro na tela
LOBBY_SLOT_SINAL = 1    -- troque para -1 se as caixas ficarem na ordem invertida
LOBBY_SLOT_Y = 70       -- altura (pixels do topo) da faixa da patente

local function Caixa(x, y, w, h, r, g, bl, a)
	SetBlend(1); glColor4f(r, g, bl, a); DrawBar(x, y, w, h); EndDrawBar(); EnableAlphaTest(); glColor3f(1, 1, 1)
end

local function SafeCall(fn, ...) if type(fn) ~= "function" then return nil end local ok, r = pcall(fn, ...) if ok then return r end return nil end
function LobbyGuildNativa()
	local cx = WindowGetWidth() / 2
	for i = 0, (MAX_CHARACTER_LIST - 1) do
		if CharacterGetIsLive(i) == 1 then
			local g = SafeCall(CharacterGuildGetName, i) or SafeCall(CharacterGetGuild, i)
			local st = SafeCall(CharacterGetGuildStatus, i)
			local rel = ((LOBBY_CUR[i] or LobbyPosY(i)) - 18570.0) / 500.0
			local x = cx + rel * LOBBY_SLOT_DX * LOBBY_SLOT_SINAL
			SetTextBg(0, 0, 0, 150); SetTextColor(255, 200, 60, 255)
			RenderText3(x, LOBBY_SLOT_Y - 18, "G:" .. tostring(g) .. " S:" .. tostring(st), 160, 3)
			SetTextBg(0, 0, 0, 0)
		end
	end
end

-- le os dados salvos da ultima vez que entrou no jogo
function LobbyCacheCarregar()
    local ok, f = pcall(io.open, "Data/Custom/LobbyCache.txt", "r")
    if not ok or not f then return nil end
    local t = {_vip = 0, _horas = 0, _motd = ""}
    for l in f:lines() do
        if l:sub(1, 1) == "#" then t._motd = l:sub(2)
        else
            local v = {} for p in (l .. "|"):gmatch("(.-)|") do v[#v + 1] = p end
            if #v >= 14 then
                local c = {}
                local F = {"nome", "guild", "status", "mark", "pk", "pklevel", "resets", "mresets", "duelos", "warkill", "honra", "eventos", "rank", "dias"}
                for i, k in ipairs(F) do c[k] = v[i] end
                for _, k in ipairs({"status","pk","pklevel","resets","mresets","duelos","warkill","honra","eventos","rank","dias"}) do c[k] = math.floor(tonumber(c[k]) or 0) end
                t[c.nome] = c
            end
        end
    end
    f:close()
    return t
end
function LobbyOverlay()
	if LOBBY_INFO == nil and not LOBBY_CACHE_LIDO then LOBBY_CACHE_LIDO = true; LOBBY_INFO = LobbyCacheCarregar() end
	if LOBBY_INFO == nil then return end
	local cx = WindowGetWidth() / 2
	if LOBBY_INFO._motd ~= "" then
		Caixa(cx - 220, 18, 440, 18, 0, 0, 0, 0.55)
		SetTextColor(237, 214, 161, 255)
		RenderText3(cx, 22, LOBBY_INFO._motd, 440, 3)
	end
	for i = 0, (MAX_CHARACTER_LIST - 1) do
		if CharacterGetIsLive(i) == 1 then
			local nome = CharacterGetName(i)
			local c = LOBBY_INFO[nome]
			if c then
				local rel = ((LOBBY_CUR[i] or LobbyPosY(i)) - 18570.0) / 500.0
				local x = cx + rel * LOBBY_SLOT_DX * LOBBY_SLOT_SINAL
				local y = LOBBY_SLOT_Y
				local sel = (GetSelectedHero() == i)
				local pt = Patente(c)
				-- faixa da patente
				Caixa(x - 70, y, 140, 16, pt[3][1] / 255, pt[3][2] / 255, pt[3][3] / 255, 0.95)
				SetTextColor(255, 240, 210, 255)
				RenderText3(x, y + 3, pt[2] .. (c.rank > 0 and ("  #" .. c.rank) or ""), 140, 3)
				-- simbolo da guild
				if c.guild ~= "" then RenderMark(x - 16, y + 20, c.mark, 4) end
				-- caixa de informacoes
				local by = y + 56
				local linhas = 3
				local pvp = ""
				if c.duelos > 0 or c.warkill > 0 then pvp = string.format("Duelos %d  Kills %d", c.duelos, c.warkill); linhas = linhas + 1 end
				local extra = ""
				if c.honra > 0 or c.eventos > 0 then extra = string.format("Honra %d  Eventos %d", c.honra, c.eventos); linhas = linhas + 1 end
				if c.pk > 0 then linhas = linhas + 1 end
				local h = 6 + linhas * 12
				if LOBBY_INFO._vip > 0 then Caixa(x - 74, by - 2, 148, h + 4, 0.85, 0.65, 0.1, 0.9) end
				Caixa(x - 72, by, 144, h, 0.03, 0.03, 0.04, sel and 0.92 or 0.75)
				local ly = by + 4
				SetTextColor(CorPk(c)); RenderText3(x, ly, nome .. (LOBBY_INFO._vip > 0 and " [VIP]" or ""), 144, 3); ly = ly + 12
				SetTextColor(235, 235, 235, 255)
				RenderText3(x, ly, c.guild ~= "" and (c.guild .. " - " .. (FUNCAO[c.status] or "Membro")) or "Sem guild", 144, 3); ly = ly + 12
				SetTextColor(200, 200, 200, 255)
				RenderText3(x, ly, string.format("Resets %d | MR %d", c.resets, c.mresets), 144, 3); ly = ly + 12
				if pvp ~= "" then SetTextColor(150, 220, 255, 255); RenderText3(x, ly, pvp, 144, 3); ly = ly + 12 end
				if extra ~= "" then SetTextColor(180, 255, 160, 255); RenderText3(x, ly, extra, 144, 3); ly = ly + 12 end
				if c.pk > 0 then SetTextColor(255, 90, 90, 255); RenderText3(x, ly, "PK: " .. c.pk, 144, 3); ly = ly + 12 end
				if sel then
					SetTextColor(160, 160, 170, 255)
					local visto = (c.dias == 0) and "jogou hoje" or ("visto ha " .. c.dias .. " dias")
					RenderText3(x, by + h + 4, visto .. "  |  conta: " .. LOBBY_INFO._horas .. "h", 200, 3)
				end
			end
		end
	end
	SetTextColor(255, 255, 255, 255)
end

-- pede guild/PK ao servidor (resposta em Customs/System/LobbyInfo.lua)
local LOBBY_PEDIDO = 0
function LobbyPedeInfo()
	if LOBBY_INFO ~= nil or CreatePacket == nil then return end
	LOBBY_PEDIDO = LOBBY_PEDIDO - 1
	if LOBBY_PEDIDO > 0 then return end
	LOBBY_PEDIDO = 180
	CreatePacket("LobbyInfo", 27)
	SendPacket("LobbyInfo")
	ClearPacket("LobbyInfo")
end

function ChangeCharacterView(index, posX, posY, posZ)
	CharacterSetPositionX(index, posX)
	CharacterSetPositionY(index, posY)
	CharacterSetPositionZ(index, posZ)

	CharacterSetAngleX(index, 0.30)
	CharacterSetAngleY(index, 0.30)
	CharacterSetAngleZ(index, 75.0)
end

function RenderProc(maxCharacter)
	if CheckCreateCharacterWindow() ~= 0
	then
		return
	end

	local frame_cx = (2 * GetWideX())

	EnableAlphaTest()

	glColor3f(1.0, 1.0, 1.0)

	SetFontType(1)

	SetTextBg(0, 0, 0, 0)

	SetTextColor(255, 255, 255, 255)

	LobbyPedeInfo()
	LobbyAnima()

	local ChangeView = 0
	local addY = 0.0

	for i = 0, (maxCharacter - 1) do
		if (CharacterGetIsLive(i) == 1)
		then
			RenderImage2(Button1Index, 470 + frame_cx, 50 + addY, 150, 35, 0, 0, 0.878, 0.82, 1, 1, 0)

			if SelectedButton == i
			then
				RenderImage2(Button2Index, 470 + frame_cx, 50 + addY, 150, 35, 0, 0, 0.878, 0.82, 1, 1, 0)
			end

			if ClickedButton == i or (GetSelectedHero() == i)
			then
				RenderImage2(Button3Index, 470 + frame_cx, 50 + addY, 150, 35, 0, 0, 0.878, 0.82, 1, 1, 0)
			end

			if ClickedButton == i
			then
				ChangeView = 1
			end

			--Set size character
			SetCharacterScale(i)

			--Render Status
			RenderCharacterStatus(470 + frame_cx, 50 + 10 + addY, i)
		else
			--Render Empty character
			RenderImage2(Button1Index, 470 + frame_cx, 50 + addY, 150, 35, 0, 0, 0.878, 0.82, 1, 1, 0)
			Console(string.format("%d - %d", SelectedButton, ClickedButton))
			if SelectedButton == i
			then
				RenderImage2(Button2Index, 470 + frame_cx, 50 + addY, 150, 35, 0, 0, 0.878, 0.82, 1, 1, 0)
			end

			if ClickedButton == i
			then
				RenderImage2(Button3Index, 470 + frame_cx, 50 + addY, 150, 35, 0, 0, 0.878, 0.82, 1, 1, 0)
			end

			RenderText3(470 + frame_cx, 50 + 10 + addY, CHARACTER_LIST_MESSAGES[GetLanguage()][1], 150, 3)
		end

		addY = addY + 37.0
	end

	if ChangeView == 1
	then
		if CharacterGetIsLive(ClickedButton) == 1
		then
			SetSelectedHero(ClickedButton)
			SetTargetCharacter(ClickedButton)

			for i = 0, (MAX_CHARACTER_LIST - 1) do
				ChangeCharacterView(i, LobbyPosX(i), LOBBY_CUR[i] or LobbyPosY(i), LOBBY_Z)
			end
		end
	end

	LobbyOverlay()

	DisableAlphaBlend()
end

SetMaxCharacter(MAX_CHARACTER_LIST)
SetPetSize(MOUNT_ADD_SIZE, FLYING_ADD_SIZE, FLYING_ADD_HEIGHT)

-- recebe os dados do lobby aqui tambem (os scripts de Manager so carregam dentro do jogo)
LobbyInfo = LobbyInfo or {}
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
if InterfaceController ~= nil and InterfaceController.ClientProtocol ~= nil then InterfaceController.ClientProtocol(LobbyInfo.Protocol)
elseif ClientProtocol == nil then
	-- no lobby o Controller/Interface ainda nao carregou: o mu.exe chama esta funcao global ao receber pacote Lua
	function ClientProtocol(Packet, PacketName) LobbyInfo.Protocol(Packet, PacketName) end
end
