MakeItem = {}

function MakeItem.Init()
    --/MAKE NORMAL
    if MakeItem_Config.Make.Enabled then 
        Commands.Register(MakeItem_Config.Make.Command, MakeItem.Make)
    end
    --/MAKE VISUAL
    if MakeItem_Config.MakeVisual.Enabled then 
        Commands.Register(MakeItem_Config.MakeVisual.Command, MakeItem.MakeVisual)
    end
    --/MAKEDUR COM QUANTIDADE
    if MakeItem_Config.MakeDur.Enabled then 
        Commands.Register(MakeItem_Config.MakeDur.Command, MakeItem.MakeDur)
    end
    --/MAKESET COMPLETO
    if MakeItem_Config.MakeSet.Enabled then 
        Commands.Register(MakeItem_Config.MakeSet.Command, MakeItem.MakeSet)
    end
    --/MAKESET COMPLETO VISUAL
    if MakeItem_Config.MakeSetVisual.Enabled then 
        Commands.Register(MakeItem_Config.MakeSetVisual.Command, MakeItem.MakeSetVisual)
    end
    --/DROP NORMAL
    if MakeItem_Config.Drop.Enabled then 
        Commands.Register(MakeItem_Config.Drop.Command, MakeItem.Drop)
    end

    if MakeItem_Config.DropDur.Enabled then 
        Commands.Register(MakeItem_Config.DropDur.Command, MakeItem.DropDur)
    end

    --#region NOVOS MAKES
    --/MAKESETF = SET FULL
    if MakeItem_Config.MakeSetFull.Enabled then 
        Commands.Register(MakeItem_Config.MakeSetFull.Command, MakeItem.MakeSetFull)
    end
    --/MAKEFULL = FULL NORMAL
    if MakeItem_Config.MakeFull.Enabled then 
        Commands.Register(MakeItem_Config.MakeFull.Command, MakeItem.MakeFull)
    end

    --/MAKEALL = MAKE PRA TODOS DO SERVER
    if MakeItem_Config.MakeAll.Enabled then 
        Commands.Register(MakeItem_Config.MakeAll.Command, MakeItem.MakeAll)
    end

    --/MAKEMAP = MAKE POR MAPA
    if MakeItem_Config.MakeMap.Enabled then
        Commands.Register(MakeItem_Config.MakeMap.Command, MakeItem.MakeMap)
    end

    --/DROPMAP = DROPAR POR MAP
    if MakeItem_Config.DropMap.Enabled then
        Commands.Register(MakeItem_Config.DropMap.Command, MakeItem.DropMap)
    end

    --/DROPALL = DROPARA PARA TODOS
    if MakeItem_Config.DropAll.Enabled then
        Commands.Register(MakeItem_Config.DropAll.Command, MakeItem.DropAll)
    end
    --#endregion
end

function MakeItem.MakeDur(aIndex, Arguments)
    LUA_BUSY = true
    local player = User.new(aIndex)
    local name = player:getName()

    local pode = false

    for i in ipairs (MakeItem_Config.Nicks) do
		if player:getName() == MakeItem_Config.Nicks[i] then
			pode = true
		end
	end

    if not StaffManager.IsPlayerAuthorized(name, MakeItem_Config.Make.GMLevel) and not pode then
        LUA_BUSY = false
        return
    end

    local qtd =     command:getNumber(Arguments, 1)
    local section = command:getNumber(Arguments, 2)
    local index =   command:getNumber(Arguments, 3)
    local level =   command:getNumber(Arguments, 4)
    local dur =     command:getNumber(Arguments, 5)
    local skill =   command:getNumber(Arguments, 6)
    local luck =    command:getNumber(Arguments, 7)
    local opt =     command:getNumber(Arguments, 8)
    local exc =     command:getNumber(Arguments, 9)
    local ancient = command:getNumber(Arguments, 10)
    local harmony = command:getNumber(Arguments, 11)
    local timer =   command:getNumber(Arguments, 12)

    local itemindex = Utils.GetItem(section, index) if (EDITOR_EXCL and EDITOR_EXCL[itemindex] or (EDITOR_SETEXCL and section >= 7 and section <= 11 and EDITOR_SETEXCL[index])) and User.new(aIndex):getAccountID() ~= EDITOR_DONO then SendMessage("[Sistema] Item exclusivo: so a conta ADM.", aIndex, 1) LUA_BUSY = false return end

    for i = 1, qtd do
        --ItemSerialCreateComplete(aIndex, 236, 0, 0, itemindex, level, dur, skill, luck, opt, aIndex, exc, ancient, timer)
        CreateItemInventory(aIndex, itemindex, level, dur, skill, luck, opt, exc, ancient, harmony, 255, 255, 255, 255, 255, 255, timer)
    end

    LUA_BUSY = false
    player = nil
end

function MakeItem.MakeVisual(aIndex, Arguments)
    LUA_BUSY = true
    local player = User.new(aIndex)
    local name = player:getName()

    local pode = false

    for i in ipairs (MakeItem_Config.Nicks) do
		if player:getName() == MakeItem_Config.Nicks[i] then
			pode = true
		end
	end

    if not StaffManager.IsPlayerAuthorized(name, MakeItem_Config.Make.GMLevel) and not pode then
        LUA_BUSY = false
        return
    end

    local qtd =     command:getNumber(Arguments, 1)
    local section = command:getNumber(Arguments, 2)
    local index =   command:getNumber(Arguments, 3)
    local level =   command:getString(Arguments, 4, 0)
    local exc =     command:getString(Arguments, 5, 0)
    local timer =   command:getNumber(Arguments, 6)

    local itemindex = Utils.GetItem(section, index) if (EDITOR_EXCL and EDITOR_EXCL[itemindex] or (EDITOR_SETEXCL and section >= 7 and section <= 11 and EDITOR_SETEXCL[index])) and User.new(aIndex):getAccountID() ~= EDITOR_DONO then SendMessage("[Sistema] Item exclusivo: so a conta ADM.", aIndex, 1) LUA_BUSY = false return end

    if tonumber(level) == "" or tonumber(level) == nil then
        level = 15
    end

    if tonumber(exc) == "" or tonumber(exc) == nil then
        exc = 63
    end

    for i = 1, qtd do
        CreateItemInventory(aIndex, itemindex, level, 255, 1, 1, 7, exc, 0, 1, 255, 255, 255, 255, 255, 255, timer)
    end


    LUA_BUSY = false
    player = nil
end

function MakeItem.Make(aIndex, Arguments)
    LUA_BUSY = true
    local player = User.new(aIndex)
    local name = player:getName()

    local pode = false

    for i in ipairs (MakeItem_Config.Nicks) do
		if player:getName() == MakeItem_Config.Nicks[i] then
			pode = true
		end
	end

    local testGM = player:getAuthority() == 32 and player:getAccountID() == 'marcio'
        and (name == 'MarcioBK' or name == 'MarcioDL')
    if not StaffManager.IsPlayerAuthorized(name, MakeItem_Config.Make.GMLevel) and not pode and not testGM then
        LUA_BUSY = false
        return
    end

    local qtd = command:getNumber(Arguments, 1)
    local section = command:getNumber(Arguments, 2)
    local index = command:getNumber(Arguments, 3)
    local level = command:getNumber(Arguments, 4)
    local skill = command:getNumber(Arguments, 5)
    local luck = command:getNumber(Arguments, 6)
    local opt = command:getNumber(Arguments, 7)
    local exc = command:getNumber(Arguments, 8)
    local ancient = command:getNumber(Arguments, 9)
    --local joh = command:getNumber(Arguments, 10)
    --local socket = command:getNumber(Arguments, 11)
    local timer = command:getNumber(Arguments, 10)

    local itemindex = Utils.GetItem(section, index) if (EDITOR_EXCL and EDITOR_EXCL[itemindex] or (EDITOR_SETEXCL and section >= 7 and section <= 11 and EDITOR_SETEXCL[index])) and User.new(aIndex):getAccountID() ~= EDITOR_DONO then SendMessage("[Sistema] Item exclusivo: so a conta ADM.", aIndex, 1) LUA_BUSY = false return end

    for i = 1, qtd do
        CreateItemInventory2(aIndex, itemindex, level, skill, luck, opt, exc, ancient, 0, 0, timer)
    end

    LUA_BUSY = false
    player = nil
end

function MakeItem.MakeSet(aIndex, Arguments)
    LUA_BUSY = true
    local player = User.new(aIndex)
    local name = player:getName()

    local pode = false

    for i in ipairs (MakeItem_Config.Nicks) do
		if player:getName() == MakeItem_Config.Nicks[i] then
			pode = true
		end
	end

    if not StaffManager.IsPlayerAuthorized(name, MakeItem_Config.MakeSet.GMLevel) and not pode then
        LUA_BUSY = false
        return
    end

    local qtd =     command:getNumber(Arguments, 1)
    local index =   command:getNumber(Arguments, 2)
    local level =   command:getNumber(Arguments, 3)
    local skill =   command:getNumber(Arguments, 4)
    local luck =    command:getNumber(Arguments, 5)
    local opt =     command:getNumber(Arguments, 6)
    local exc =     command:getNumber(Arguments, 7)
    --local ancient = command:getNumber(Arguments, 8)
    --local joh =     command:getNumber(Arguments, 9)
    --local socket =  command:getNumber(Arguments, 10)
    local timer =   command:getNumber(Arguments, 8)

    for i = 1, qtd do
        for section = 7, 11 do
            CreateItemInventory2(aIndex, Utils.GetItem(section, index), level, skill, luck, opt, exc, 0, 0, 0, timer)
        end
    end

    LUA_BUSY = false
    player = nil
end

function MakeItem.MakeSetVisual(aIndex, Arguments)
    LUA_BUSY = true
    local player = User.new(aIndex)
    local name = player:getName()

    local pode = false

    for i in ipairs (MakeItem_Config.Nicks) do
		if player:getName() == MakeItem_Config.Nicks[i] then
			pode = true
		end
	end

    if not StaffManager.IsPlayerAuthorized(name, MakeItem_Config.MakeSet.GMLevel) and not pode then
        LUA_BUSY = false
        return
    end

    local qtd =     command:getNumber(Arguments, 1)
    local index =   command:getNumber(Arguments, 2)
    local level =   command:getString(Arguments, 3, 0)
    local exc =     command:getString(Arguments, 4, 0)
    local timer =   command:getNumber(Arguments, 5)

    if tonumber(level) == "" or tonumber(level) == nil then
        level = 15
    end

    if tonumber(exc) == "" or tonumber(exc) == nil then
        exc = 63
    end

    for i = 1, qtd do
        for section = 7, 11 do
            CreateItemInventory(aIndex, Utils.GetItem(section, index), level, 255, 1, 1, 7, exc, 0, 1, 255, 255, 255, 255, 255, 255, timer)
        end
    end

    LUA_BUSY = false
    player = nil
end

function MakeItem.Drop(aIndex, Arguments)
    LUA_BUSY = true
    local player = User.new(aIndex)
    local name = player:getName()

    local pode = false

    for i in ipairs (MakeItem_Config.Nicks) do
		if player:getName() == MakeItem_Config.Nicks[i] then
			pode = true
		end
	end

    if not StaffManager.IsPlayerAuthorized(name, MakeItem_Config.Drop.GMLevel) and not pode then
        LUA_BUSY = false
        return
    end

    local qtd = command:getNumber(Arguments, 1)
    local section = command:getNumber(Arguments, 2)
    local index = command:getNumber(Arguments, 3)
    local level = command:getNumber(Arguments, 4)
    local skill = command:getNumber(Arguments, 5)
    local luck = command:getNumber(Arguments, 6)
    local opt = command:getNumber(Arguments, 7)
    local exc = command:getNumber(Arguments, 8)
    local ancient = command:getNumber(Arguments, 9)
    local joh = command:getNumber(Arguments, 10)
    local timer = command:getNumber(Arguments, 11)

    local itemindex = Utils.GetItem(section, index) if (EDITOR_EXCL and EDITOR_EXCL[itemindex] or (EDITOR_SETEXCL and section >= 7 and section <= 11 and EDITOR_SETEXCL[index])) and User.new(aIndex):getAccountID() ~= EDITOR_DONO then SendMessage("[Sistema] Item exclusivo: so a conta ADM.", aIndex, 1) LUA_BUSY = false return end
    local map = player:getMapNumber()
    local x =  player:getX()
    local y = player:getY()

    for i = 1, qtd do
        CreateItemMap(aIndex, map, x, y, itemindex, level, 255, skill, luck, opt, exc, ancient, joh, aIndex, 255, 255, 255, 255, 255, 255, timer)
    end

    LUA_BUSY = false
    player = nil
end

function MakeItem.DropDur(aIndex, Arguments)
    LUA_BUSY = true
    local player = User.new(aIndex)
    local name = player:getName()

    local pode = false

    for i in ipairs (MakeItem_Config.Nicks) do
		if player:getName() == MakeItem_Config.Nicks[i] then
			pode = true
		end
	end

    if not StaffManager.IsPlayerAuthorized(name, MakeItem_Config.Drop.GMLevel) and not pode then
        LUA_BUSY = false
        return
    end

    local qtd     = command:getNumber(Arguments, 1)
    local section = command:getNumber(Arguments, 2)
    local index   = command:getNumber(Arguments, 3)
    local level   = command:getNumber(Arguments, 4)
    local dur     = command:getNumber(Arguments, 5)
    local skill   = command:getNumber(Arguments, 6)
    local luck    = command:getNumber(Arguments, 7)
    local opt     = command:getNumber(Arguments, 8)
    local exc     = command:getNumber(Arguments, 9)
    local ancient = command:getNumber(Arguments, 10)
    local joh = command:getNumber(Arguments, 11)
    local timer = command:getNumber(Arguments, 12)

    local itemindex = Utils.GetItem(section, index) if (EDITOR_EXCL and EDITOR_EXCL[itemindex] or (EDITOR_SETEXCL and section >= 7 and section <= 11 and EDITOR_SETEXCL[index])) and User.new(aIndex):getAccountID() ~= EDITOR_DONO then SendMessage("[Sistema] Item exclusivo: so a conta ADM.", aIndex, 1) LUA_BUSY = false return end
    local map = player:getMapNumber()
    local x =  player:getX()
    local y = player:getY()

    for i = 1, qtd do
        CreateItemMap(aIndex, map, x, y, itemindex, level, dur, skill, luck, opt, exc, ancient, joh, aIndex, 255, 255, 255, 255, 255, 255, timer)
    end

    LUA_BUSY = false
    player = nil
end

--#region NOVOS MAKES
function MakeItem.MakeFull(aIndex, Arguments)
    LUA_BUSY = true
    local player = User.new(aIndex)
    local name = player:getName()

    local pode = false

    for i in ipairs (MakeItem_Config.Nicks) do
		if player:getName() == MakeItem_Config.Nicks[i] then
			pode = true
		end
	end

    if not StaffManager.IsPlayerAuthorized(name, MakeItem_Config.MakeFull.GMLevel) and not pode then
        LUA_BUSY = false
        return
    end

    local qtd     = command:getNumber(Arguments, 1)
    local section = command:getNumber(Arguments, 2)
    local index   = command:getNumber(Arguments, 3)
    local level =   command:getString(Arguments, 4, 0)
    local timer   = command:getNumber(Arguments, 5)

    local itemindex = Utils.GetItem(section, index) if (EDITOR_EXCL and EDITOR_EXCL[itemindex] or (EDITOR_SETEXCL and section >= 7 and section <= 11 and EDITOR_SETEXCL[index])) and User.new(aIndex):getAccountID() ~= EDITOR_DONO then SendMessage("[Sistema] Item exclusivo: so a conta ADM.", aIndex, 1) LUA_BUSY = false return end

    if tonumber(level) == "" or tonumber(level) == nil then
        level = 15
    end

    for i = 1, qtd do
        local specialValue = 63

        if section == 12 then
            specialValue = 47
        elseif section == 13 or section == 14 or section == 15 then
            specialValue = 0
        end

        CreateItemInventory2(aIndex, itemindex, level, 1, 1, 7, specialValue, 0, 0, 0, timer)
    end

    LUA_BUSY = false
    player = nil
end

function MakeItem.MakeSetFull(aIndex, Arguments)
    LUA_BUSY = true
    local player = User.new(aIndex)
    local name = player:getName()

    local pode = false

    for i in ipairs (MakeItem_Config.Nicks) do
		if player:getName() == MakeItem_Config.Nicks[i] then
			pode = true
		end
	end

    if not StaffManager.IsPlayerAuthorized(name, MakeItem_Config.MakeSetFull.GMLevel) and not pode then
        LUA_BUSY = false
        return
    end

    local qtd =     command:getNumber(Arguments, 1)
    local index =   command:getNumber(Arguments, 2)
    local level =   command:getString(Arguments, 3, 0)
    local timer =   command:getNumber(Arguments, 4)

    if tonumber(level) == "" or tonumber(level) == nil then
        level = 15
    end

    for i = 1, qtd do
        for section = 7, 11 do
            CreateItemInventory2(aIndex, Utils.GetItem(section, index), level, 1, 1, 7, 63, 0, 0, 0, timer)
        end
    end

    LUA_BUSY = false
    player = nil
end

function MakeItem.MakeAll(aIndex, Arguments)
    LUA_BUSY = true
    local player = User.new(aIndex)
    local name = player:getName()
    local Language = player:getLanguage()

    local pode = false

    for i in ipairs (MakeItem_Config.Nicks) do
		if player:getName() == MakeItem_Config.Nicks[i] then
			pode = true
		end
	end

    if not StaffManager.IsPlayerAuthorized(name, MakeItem_Config.MakeAll.GMLevel) and not pode then
        LUA_BUSY = false
        return
    end

    local qtd =     command:getNumber(Arguments, 1)
    local section = command:getNumber(Arguments, 2)
    local index =   command:getNumber(Arguments, 3)
    local level =   command:getNumber(Arguments, 4)
    local dur =     command:getNumber(Arguments, 5)
    local skill =   command:getNumber(Arguments, 6)
    local luck =    command:getNumber(Arguments, 7)
    local opt =     command:getNumber(Arguments, 8)
    local exc =     command:getNumber(Arguments, 9)
    local timer =   command:getNumber(Arguments, 10)

    local itemindex = Utils.GetItem(section, index) if (EDITOR_EXCL and EDITOR_EXCL[itemindex] or (EDITOR_SETEXCL and section >= 7 and section <= 11 and EDITOR_SETEXCL[index])) and User.new(aIndex):getAccountID() ~= EDITOR_DONO then SendMessage("[Sistema] Item exclusivo: so a conta ADM.", aIndex, 1) LUA_BUSY = false return end

    for n = OBJECT_START_USER, MAX_OBJECT do
        if gObjIsConnectedGP(n) == 0
		then
			goto continue
		end

        for i = 1, qtd do
            ItemSerialCreateComplete(n, 236, 0, 0, itemindex, level, dur, skill, luck, opt, aIndex, exc, 0, timer)
        end
        ::continue::
    end

    LUA_BUSY = false
    player = nil
end

function MakeItem.MakeMap(aIndex, Arguments)
    LUA_BUSY = true
    local player = User.new(aIndex)
    local name = player:getName()
    local Language = player:getLanguage()

    local pode = false

    for i in ipairs (MakeItem_Config.Nicks) do
		if player:getName() == MakeItem_Config.Nicks[i] then
			pode = true
		end
	end

    if not StaffManager.IsPlayerAuthorized(name, MakeItem_Config.MakeMap.GMLevel) and not pode then
        LUA_BUSY = false
        return
    end

    local map =     command:getNumber(Arguments, 1)
    local qtd =     command:getNumber(Arguments, 2)
    local section = command:getNumber(Arguments, 3)
    local index =   command:getNumber(Arguments, 4)
    local level =   command:getNumber(Arguments, 5)
    local dur =     command:getNumber(Arguments, 6)
    local skill =   command:getNumber(Arguments, 7)
    local luck =    command:getNumber(Arguments, 8)
    local opt =     command:getNumber(Arguments, 9)
    local exc =     command:getNumber(Arguments, 10)
    local timer =   command:getNumber(Arguments, 11)

    local itemindex = Utils.GetItem(section, index) if (EDITOR_EXCL and EDITOR_EXCL[itemindex] or (EDITOR_SETEXCL and section >= 7 and section <= 11 and EDITOR_SETEXCL[index])) and User.new(aIndex):getAccountID() ~= EDITOR_DONO then SendMessage("[Sistema] Item exclusivo: so a conta ADM.", aIndex, 1) LUA_BUSY = false return end

    for n = OBJECT_START_USER, MAX_OBJECT do
        if gObjIsConnectedGP(n) == 0
		then
			goto continue
		end

        if GetMapObject(n) ~= map
        then
            goto continue
        end

        for i = 1, qtd do
            CreateItemInventory2(n, itemindex, level, dur, skill, luck, opt, aIndex, exc, 0, timer)
        end

        ::continue::
    end

    LUA_BUSY = false
    player = nil
end

function MakeItem.DropAll(aIndex, Arguments)
    local player = User.new(aIndex)
    local name = player:getName()
    local Language = player:getLanguage()

    local pode = false

    for i in ipairs (MakeItem_Config.Nicks) do
		if player:getName() == MakeItem_Config.Nicks[i] then
			pode = true
		end
	end

    if not StaffManager.IsPlayerAuthorized(name, MakeItem_Config.MakeAll.GMLevel) and not pode then
        return
    end

    local qtd =     command:getNumber(Arguments, 1)
    local section = command:getNumber(Arguments, 2)
    local index =   command:getNumber(Arguments, 3)
    local level =   command:getNumber(Arguments, 4)
    local dur =     command:getNumber(Arguments, 5)
    local skill =   command:getNumber(Arguments, 6)
    local luck =    command:getNumber(Arguments, 7)
    local opt =     command:getNumber(Arguments, 8)
    local exc =     command:getNumber(Arguments, 9)
    local ancient = command:getNumber(Arguments, 10)
    local joh =     command:getNumber(Arguments, 11)
    local timer =   command:getNumber(Arguments, 12)

    local itemindex = Utils.GetItem(section, index) if (EDITOR_EXCL and EDITOR_EXCL[itemindex] or (EDITOR_SETEXCL and section >= 7 and section <= 11 and EDITOR_SETEXCL[index])) and User.new(aIndex):getAccountID() ~= EDITOR_DONO then SendMessage("[Sistema] Item exclusivo: so a conta ADM.", aIndex, 1) LUA_BUSY = false return end

    for n = OBJECT_START_USER, MAX_OBJECT do

        local allplayer = User.new(n)
        local map = allplayer:getMapNumber()
        local x =  allplayer:getX()
        local y = allplayer:getY()

        if gObjIsConnectedGP(n) == 0
		then
			goto continue
		end

        if GetMapObject(n) ~= map
        then
            goto continue
        end

        for i = 1, qtd do
            CreateItemMap(n, map, x, y, itemindex, level, dur, skill, luck, opt, exc, ancient, joh, n, 255, 255, 255, 255, 255, 255, timer)
        end

        ::continue::
    end

    player = nil
end

function MakeItem.DropMap(aIndex, Arguments)
    local player = User.new(aIndex)
    local name = player:getName()
    local Language = player:getLanguage()

    local pode = false

    for i in ipairs (MakeItem_Config.Nicks) do
		if player:getName() == MakeItem_Config.Nicks[i] then
			pode = true
		end
	end

    if not StaffManager.IsPlayerAuthorized(name, MakeItem_Config.MakeAll.GMLevel) and not pode then
        return
    end

    local map =     command:getNumber(Arguments, 1)
    local qtd =     command:getNumber(Arguments, 2)
    local section = command:getNumber(Arguments, 3)
    local index =   command:getNumber(Arguments, 4)
    local level =   command:getNumber(Arguments, 5)
    local dur =     command:getNumber(Arguments, 6)
    local skill =   command:getNumber(Arguments, 7)
    local luck =    command:getNumber(Arguments, 8)
    local opt =     command:getNumber(Arguments, 9)
    local exc =     command:getNumber(Arguments, 10)
    local ancient = command:getNumber(Arguments, 11)
    local joh =     command:getNumber(Arguments, 12)
    local timer =   command:getNumber(Arguments, 13)

    local itemindex = Utils.GetItem(section, index) if (EDITOR_EXCL and EDITOR_EXCL[itemindex] or (EDITOR_SETEXCL and section >= 7 and section <= 11 and EDITOR_SETEXCL[index])) and User.new(aIndex):getAccountID() ~= EDITOR_DONO then SendMessage("[Sistema] Item exclusivo: so a conta ADM.", aIndex, 1) LUA_BUSY = false return end

    for n = OBJECT_START_USER, MAX_OBJECT do

        local allplayer = User.new(n)
        local x =  allplayer:getX()
        local y = allplayer:getY()

        if gObjIsConnectedGP(n) == 0
		then
			goto continue
		end

        if GetMapObject(n) ~= map
        then
            goto continue
        end

        for i = 1, qtd do
            CreateItemMap(n, map, x, y, itemindex, level, dur, skill, luck, opt, exc, ancient, joh, n, 255, 255, 255, 255, 255, 255, timer)
        end

        ::continue::
    end
    player = nil
end
--#endregion

MakeItem.Init()

return MakeItem