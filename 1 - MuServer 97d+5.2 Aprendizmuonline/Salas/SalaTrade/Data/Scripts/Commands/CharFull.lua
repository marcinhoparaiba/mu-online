--[[ Sistema CharFull (MuBanneD): level 600, 2a classe, pontos e zen no maximo ]]--
CharFull = {}

function CharFull.Command(aIndex, Arguments)
	local _p = User.new(aIndex)
	if _p:getAuthority() < 32 and _p:getAccountID() ~= 'admin' then SendMessage('[Sistema] /full: so GM e ADM.', aIndex, 1) return end -- so GM e ADM
	if CHARFULL_COMMAND_SWITCH ~= 1
	then
		return
	end

	local player = User.new(aIndex)
	local class = player:getClass()

	-- evolucao: SM, BK, Elfo e SU ganham a 2a classe (MG e DL nao tem)
	if player:getChangeUP() == 0 and (class == 0 or class == 1 or class == 2 or class == 5)
	then
		local dbclass = class * 16 + 1
		player:setDbClass(dbclass)
		player:setChangeUP(1)
		local NewClass = player:getChangeUP() * 16
		NewClass = NewClass - (NewClass / 32)
		NewClass = NewClass + (class * 32)
		SendQuestPrize(aIndex, 201, NewClass)
	end

	player:setLevel(600)
	player:setLevelUpPoint(0)
	player:setStrength(32767)
	player:setDexterity(32767)
	player:setVitality(32767)
	player:setEnergy(32767)
	if class == 4
	then
		player:setLeaderShip(32767)
	end
	player:setMoney(2000000000)

	ClearViewPort(aIndex)
	MakePreview(aIndex)
	ViewportCreate(aIndex)
	CalCharacter(aIndex)
	LevelUpSend(aIndex)
	MoneySend(aIndex)

	SendMessage("[Sistema] Char Full: level 600, classe evoluida, pontos e zen no maximo!", aIndex, 1)
	player = nil
end

Commands.Register(CHARFULL_COMMAND, CharFull.Command)

return CharFull
