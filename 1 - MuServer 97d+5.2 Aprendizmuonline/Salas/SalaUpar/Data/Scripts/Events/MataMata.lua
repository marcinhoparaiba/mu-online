-- Inicio da Configuração
MataMata_Config = {
    Enabled = true,

    -- Version = 2 (season 2)
    -- Version = 6 (season 6)
    Version = 6,

    Command = {
        ["Eng"] = {
            Open = "/abrirmtmt",
            Go = "/matamata",
            Cancel = "/cancelarmtmt"
        },
        ["Por"] = {
            Open = "/abrirmtmt", -- /comando tempo type, se nao digitar type ser� um mata-mata normal
            Go = "/matamata",
            Cancel = "/cancelarmtmt"
        },
        ["Spn"] = {
            Open = "/abrirmtmt",
            Go = "/matamata",
            Cancel = "/cancelarmtmt"
        },
    },

    Cron = {
        {DayOfMonth = -1, DayOfWeek = -1, Hour = 0, Minute = 0, Type = 2, AnnounceName = 40},
        {DayOfMonth = -1, DayOfWeek = -1, Hour = 0, Minute = 10, Type = -1, AnnounceName = -1},
    },

    TimeAnnounce = 2, -- tempo em minutos que avisa que vai haver o evento

    TimeOpen = 15, -- tempo em segundo que o comando entrar fica aberto

    Area = { -- Somente dois mapas
        [1] = {
            Total = {Map  = 6, X1 = 185, X2 = 247, Y1 = 144, Y2 = 246},
            Wait = {Map  = 6, X1 = 185, X2 = 247, Y1 = 144, Y2 = 246},
            PvP = {Map  = 6, X1 = 196, X2 = 234, Y1 = 166, Y2 = 227},
            Spot = {
                [1] = {Map  = 6, X = 215, Y = 195},
                [2] = {Map  = 6, X = 217, Y = 195},
            },
            Watch = {Map  = 6, X = 216, Y = 192},
            Respawn = {Map  = 6, X = 195, Y = 195},
        },

        [2] = {
            Total = {Map  = 6, X1 = 185, X2 = 247, Y1 = 27, Y2 = 131},
            Wait = {Map  = 6, X1 = 185, X2 = 247, Y1 = 27, Y2 = 131},
            PvP = {Map  = 6, X1 = 196, X2 = 234, Y1 = 48, Y2 = 113},
            Spot = {
                [1] = {Map  = 6, X = 215, Y = 76},
                [2] = {Map  = 6, X = 217, Y = 76},
            },
            Watch = {Map  = 6, X = 216, Y = 73},
            Respawn = {Map  = 6, X = 195, Y = 76},
        }
    },

    Rounds = { -- a quantidade de rounds deve ser sempre IMPAR (1, 3, 5, etc) 
        Normal = 1, -- quantidades de rounds a ser disputados em lutas normais
        Semi = 1, -- quantidade de rounds a ser disputados na semi-final
        Final = 3 -- quantidade de rounds a ser disputados na final
    },
	
	RoundDelay = 10, -- segundos que demora entre uma luta e outra

    LogoutExitEvent = true, -- true = � removido do evento se relogar, false pode voltar ao evento se ainda estiver na mesma fase

    RemoveBuffBeforeFight = true, -- true remove todos so buffs do char antes de lutar, false nao remove

    Prize = {
        [1] = {
            {Name = "WCoinC", Amount = 30, Table = "CashShopData", Column = "WCoinC", Where = "AccountID", IdType = 0, Announce = true},
            {Name = "Mata-Mata", Amount = 3, Table = "Character", Column = "matamata", Where = "AccountID", IdType = 0, Announce = true},
        },
        [2] = {
            {Name = "WCoinC", Amount = 20, Table = "CashShopData", Column = "WCoinC", Where = "AccountID", IdType = 0, Announce = true},
            {Name = "Mata-Mata", Amount = 2, Table = "Character", Column = "matamata", Where = "AccountID", IdType = 0, Announce = true},
        },
        [3] = {
            {Name = "WCoinC", Amount = 10, Table = "CashShopData", Column = "WCoinC", Where = "AccountID", IdType = 0, Announce = true},
            {Name = "Mata-Mata", Amount = 1, Table = "Character", Column = "matamata", Where = "AccountID", IdType = 0, Announce = true},
        },
    },

    CounterItem = { -- Remove = mortes removidas quando perde, Add = mortes adicionadas quando ganha, so funciona para itens no slot 0
        [20] = {Remove = 1, Add = 1},
    },

    Types = {
        [1] = {Name = 38, AllowedItem = 1, AllowedClass = 1, Invite = -1},
        [2] = {Name = 39, AllowedItem = -1, AllowedClass = -1, Invite = 1},
    },

    Invite = {
        [1] = {Amount = 1, Section = 14, Index = 32, Level = -1},
    },

    AllowedClasses = {
        [1] = {
            [0] = false, -- SM
            [1] = true,  -- BK
            [2] = false, -- ELF
            [3] = false, -- MG
            [4] = false, -- DL
            [5] = false, -- SUM
            [6] = false, -- RF
        }
    },

    AllowedItens = {
        [1] = {
            {Section = 0 , Index = 1 , MaxLevel = 3, Skill = 0, Luck = 0, MaxOpt = 3, MaxExc = 0, Ancient = 0},
            {Section = 6 , Index = 20, MaxLevel = 3, Skill = 0, Luck = 0, MaxOpt = 3, MaxExc = 0, Ancient = 0},
            {Section = 7 , Index = 1 , MaxLevel = 3, Skill = 0, Luck = 0, MaxOpt = 3, MaxExc = 0, Ancient = 0},
            {Section = 8 , Index = 1 , MaxLevel = 3, Skill = 0, Luck = 0, MaxOpt = 3, MaxExc = 0, Ancient = 0},
            {Section = 9 , Index = 1 , MaxLevel = 3, Skill = 0, Luck = 0, MaxOpt = 3, MaxExc = 0, Ancient = 0},
            {Section = 10, Index = 1 , MaxLevel = 3, Skill = 0, Luck = 0, MaxOpt = 3, MaxExc = 0, Ancient = 0},
            {Section = 11, Index = 1 , MaxLevel = 3, Skill = 0, Luck = 0, MaxOpt = 3, MaxExc = 0, Ancient = 0},
        },
    },

    Message = {
        ["Eng"] = {
            [1] = "Já existe um Mata-Mata aberto, use %s para cancelar",
            [2] = "Tempo mínimo 5 segundos, use %s <tempo>",
            [3] = " Evento Mata-Mata foi aberto",
            [4] = ">>>>>>   Evento Mata-Mata   <<<<<<",
            [5] = "%s fecha em %d segundos",
            [6] = "%s fecha em %d segundo",
            [7] = "Não existe um Mata-Mata aberto, use %s para abrir",
            [8] = "Evento Mata-Mata foi cancelado",
            [9] = "Não há evento Mata-mata aberto no momento",
            [10] = "Você foi movido ao evento",
            [11] = "==================================",
            [12] = "%s",
            [13] = "X",
            [14] = "Fase Final Iniciada",
            [15] = "%s passou de fase por falta de oponente",
            [16] = "%d° Fase Iniciada",
            [17] = "Mata-Mata cancelado por falta de participantes",
            [18] = "ATENÇÃO!",
            [19] = "JAAH!",
            [20] = "%d",
            [21] = "%s Win",
            [22] = "VENCEDORES:",
            [23] = "%d° - %s",
            [24] = "Fase Semi Final Iniciada",
            [25] = "Fase Final de 3 Iniciada",
            [26] = "%s[%s] Win",
            [27] = "Tipo de evento não existe",
            [28] = " Sua classe não é permitida nesse evento",
            [29] = " Você está usando itens proibidos no evento",
            [30] = " Você precisa ter o convite no seu inventário para participar",
            [31] = "%s %d X %d %s",
            [32] = "=========== Melhor de %d ===========",
            [33] = " Parabêns, você foi o %d° colocado",
            [34] = " Você recebeu %d %s",
            [35] = " Evento Mata-Mata finalizado",
            [36] = " Você foi removido do evento",
            [37] = " Mata-Mata inicia em %d minuto(s)",
            [38] = ">>>>>>   Evento Mata-Mata Iniciante (BK's)   <<<<<<",
            [39] = ">>>>>>   Evento Mata-Mata Privado   <<<<<<",
            [40] = "Mata-Mata Privado inicia em %d minuto(s)"
        },

        ["Por"] = {
            [1] = "Já existe um Mata-Mata aberto, use %s para cancelar",
            [2] = "Tempo mínimo 5 segundos, use %s <tempo>",
            [3] = " Evento Mata-Mata foi aberto",
            [4] = ">>>>>>   Evento Mata-Mata   <<<<<<",
            [5] = "%s fecha em %d segundos",
            [6] = "%s fecha em %d segundo",
            [7] = "Não existe um Mata-Mata aberto, use %s para abrir",
            [8] = "Evento Mata-Mata foi cancelado",
            [9] = "Não há evento Mata-mata aberto no momento",
            [10] = "Você foi movido ao evento",
            [11] = "==================================",
            [12] = "%s",
            [13] = "X",
            [14] = "Fase Final Iniciada",
            [15] = "%s passou de fase por falta de oponente",
            [16] = "%d° Fase Iniciada",
            [17] = "Mata-Mata cancelado por falta de participantes",
            [18] = "ATENÇÃO!",
            [19] = "JAAH!",
            [20] = "%d",
            [21] = "%s Win",
            [22] = "VENCEDORES:",
            [23] = "%d° - %s",
            [24] = "Fase Semi Final Iniciada",
            [25] = "Fase Final de 3 Iniciada",
            [26] = "%s[%s] Win",
            [27] = "Tipo de evento não existe",
            [28] = " Sua classe não é permitida nesse evento",
            [29] = " Você está usando itens proibidos no evento",
            [30] = " Você precisa ter o convite no seu inventário para participar",
            [31] = "%s %d X %d %s",
            [32] = "=========== Melhor de %d ===========",
            [33] = " Parabêns, você foi o %d° colocado",
            [34] = " Você recebeu %d %s",
            [35] = " Evento Mata-Mata finalizado",
            [36] = " Você foi removido do evento",
            [37] = " Mata-Mata inicia em %d minuto(s)",
            [38] = ">>>>>>   Evento Mata-Mata Iniciante (BK's)   <<<<<<",
            [39] = ">>>>>>   Evento Mata-Mata Privado   <<<<<<",
            [40] = "Mata-Mata Privado inicia em %d minuto(s)"
        },

        ["Spn"] = {
            [1] = "Já existe um Mata-Mata aberto, use %s para cancelar",
            [2] = "Tempo mínimo 5 segundos, use %s <tempo>",
            [3] = " Evento Mata-Mata foi aberto",
            [4] = ">>>>>>   Evento Mata-Mata   <<<<<<",
            [5] = "%s fecha em %d segundos",
            [6] = "%s fecha em %d segundo",
            [7] = "Não existe um Mata-Mata aberto, use %s para abrir",
            [8] = "Evento Mata-Mata foi cancelado",
            [9] = "Não há evento Mata-mata aberto no momento",
            [10] = "Você foi movido ao evento",
            [11] = "==================================",
            [12] = "%s",
            [13] = "X",
            [14] = "Fase Final Iniciada",
            [15] = "%s passou de fase por falta de oponente",
            [16] = "%d° Fase Iniciada",
            [17] = "Mata-Mata cancelado por falta de participantes",
            [18] = "ATENÇÃO!",
            [19] = "JAAH!",
            [20] = "%d",
            [21] = "%s Win",
            [22] = "VENCEDORES:",
            [23] = "%d° - %s",
            [24] = "Fase Semi Final Iniciada",
            [25] = "Fase Final de 3 Iniciada",
            [26] = "%s[%s] Win",
            [27] = "Tipo de evento não existe",
            [28] = " Sua classe não é permitida nesse evento",
            [29] = " Você está usando itens proibidos no evento",
            [30] = " Você precisa ter o convite no seu inventário para participar",
            [31] = "%s %d X %d %s",
            [32] = "=========== Melhor de %d ===========",
            [33] = " Parabêns, você foi o %d° colocado",
            [34] = " Você recebeu %d %s",
            [35] = " Evento Mata-Mata finalizado",
            [36] = " Você foi removido do evento",
            [37] = " Mata-Mata inicia em %d minuto(s)",
            [38] = ">>>>>>   Evento Mata-Mata Iniciante (BK's)   <<<<<<",
            [39] = ">>>>>>   Evento Mata-Mata Privado   <<<<<<",
            [40] = "Mata-Mata Privado inicia em %d minuto(s)"
        },
    }
}

-- Iniciou do Codigo 

MataMata = {}

function MataMata.Init()    	
    
    if MataMata_Config.Enabled then
        Commands.Register(MataMata_Config.Command["Eng"].Open, MataMata.CommandOpen)
        Commands.Register(MataMata_Config.Command["Por"].Open, MataMata.CommandOpen)
        Commands.Register(MataMata_Config.Command["Spn"].Open, MataMata.CommandOpen)
        Commands.Register(MataMata_Config.Command["Eng"].Go, MataMata.CommandGo)
        Commands.Register(MataMata_Config.Command["Por"].Go, MataMata.CommandGo)
        Commands.Register(MataMata_Config.Command["Spn"].Go, MataMata.CommandGo)
        Commands.Register(MataMata_Config.Command["Eng"].Cancel, MataMata.CommandCancel)
        Commands.Register(MataMata_Config.Command["Por"].Cancel, MataMata.CommandCancel)
        Commands.Register(MataMata_Config.Command["Spn"].Cancel, MataMata.CommandCancel)

        GameServerFunctions.PlayerAttack(MataMata.PlayerAttack)
        GameServerFunctions.PlayerDie(MataMata.PlayerDie)
        GameServerFunctions.PlayerLogout(MataMata.PlayerLogout)
        GameServerFunctions.EnterCharacter(MataMata.EnterCharacter)

        MataMata.Define()

        for i in ipairs(MataMata_Config.Cron) do
            if MataMata_Config.Cron[i].DayOfWeek ~= -1 then
                Schedule.SetDayOfWeek(MataMata_Config.Cron[i].DayOfWeek, MataMata_Config.Cron[i].Hour, MataMata_Config.Cron[i].Minute, MataMata.Announce, MataMata_Config.TimeAnnounce, MataMata_Config.Cron[i].Type, MataMata_Config.Cron[i].AnnounceName)
            elseif MataMata_Config.Cron[i].DayOfMonth ~= -1 then
                Schedule.SetDayAndHourAndMinute(MataMata_Config.Cron[i].DayOfMonth, MataMata_Config.Cron[i].Hour, MataMata_Config.Cron[i].Minute, MataMata.Announce, MataMata_Config.TimeAnnounce, MataMata_Config.Cron[i].Type, MataMata_Config.Cron[i].AnnounceName)
            else
                Schedule.SetHourAndMinute(MataMata_Config.Cron[i].Hour, MataMata_Config.Cron[i].Minute, MataMata.Announce, MataMata_Config.TimeAnnounce, MataMata_Config.Cron[i].Type, MataMata_Config.Cron[i].AnnounceName)
            end
        end
    end
end

function MataMata.Define()
    MataMata.Counter = {
        Open = 0,
    }
    MataMata.Timer = {
        Open = -1,
        CheckEvent = -1,
        CheckPvPArea = -1,
    }
    MataMata.Status = {
        Running = false,
        Open = false,
        Started = false,
        Luta = false,
    }
    MataMata.EventType = 0
    MataMata.Fase = 1
    MataMata.CurrentArea = 1
    MataMata.SemiFinal = 200
    MataMata.Final = 201
    MataMata.Participantes = {}
    MataMata.Vencedores = {}
    MataMata.Lutando = {
        [1] = {Info = {[1] = "", [2] = -1}},
        [2] = {Info = {[1] = "", [2] = -1}},
    }
    MataMata.CurrentRound = 1
    MataMata.GMIndex = -1
end

function MataMata.Announce(tempo, tipo, name)
    if tempo == 0 then
        local t = MataMata_Config.TimeOpen

        MataMata.EventType = tipo

        MataMata.Counter.Open = t

        MataMata.Status.Running = true
        MataMata.Status.Open = true

        Message.SendMessageGlobalMultLang(MataMata_Config.Message, 3, 1)
        if MataMata.EventType > 0 then
            Message.SendMessageGlobalMultLang(MataMata_Config.Message, MataMata_Config.Types[MataMata.EventType].Name, 0)
        else
            Message.SendMessageGlobalMultLang(MataMata_Config.Message, 4, 0)
        end
        MataMata.Timer.Open = Timer.Repeater(1, t, MataMata.AnnounceEventOpen)
        MataMata.Timer.CheckEvent = Timer.Interval(1, MataMata.CheckEvent)
        MataMata.Timer.CheckPvPArea = Timer.Interval(1, MataMata.CheckPvPArea)
        return
    else
        Message.SendMessageGlobalMultLangArgs(MataMata_Config.Message, name, 0, tempo)
        tempo = tempo - 1
        Timer.TimeOut(60, MataMata.Announce, tempo, tipo, name)
    end
end

function MataMata.CheckEvent()
    if not MataMata.Status.Running then 
        if MataMata.Timer.CheckEvent ~= -1 then
            Timer.Cancel(MataMata.Timer.CheckEvent)
            MataMata.Timer.CheckEvent = -1
        end
        return
    end

    for aIndex = 13000, 13999 do
        local player = User.new(aIndex)
        if player:getConnected() == 3 then 

        local nome = player:getName()
        if MataMata.CheckIfIsPlayer(nome) then
            local map = player:getMapNumber()
            local x = player:getX()
            local y = player:getY()
            local noEvento = false
            for a = 1, 2 do
                local area = MataMata_Config.Area[a].Total
                if map == area.Map then
                    if x >= area.X1 and x <= area.X2 and y >= area.Y1 and y <= area.Y2 then
                        noEvento = true
                        LogAddC(2, string.format("%s no evento", player:getName()))
                    end
                end
            end

            if not noEvento then
                for i in ipairs(MataMata.Participantes) do
                    if MataMata.Participantes[i] ~= nil then
                        if MataMata.Participantes[i].Active then
                            if MataMata.Participantes[i].Info[1] == nome then
                                if MataMata.Participantes[i].Lutando then
                                    local vencedor = {}
                                    local perdedor = {}

                                    if MataMata.Lutando[1].Info[1] == nome then
                                        perdedor = MataMata.Lutando[1]
                                        vencedor = MataMata.Lutando[2]
                                    else
                                        perdedor = MataMata.Lutando[2]
                                        vencedor = MataMata.Lutando[1]
                                    end
                                    MataMata.Participantes[i].Active = false
                                    MataMata.Participantes[i].Removed = true
                                    MataMata.WinByDefault(vencedor.Info[2], perdedor.Info[2])
                                else
                                    MataMata.RemoverPlayer(nome)
                                end
                            end
                        end
                    end
                end
                LogAddC(2, string.format("%s fora do evento", player:getName()))
            end
        end

        end
    end
end

function MataMata.CheckPvPArea()
    if not MataMata.Status.Running then 
        if MataMata.Timer.CheckEvent ~= -1 then
            Timer.Cancel(MataMata.Timer.CheckEvent)
            MataMata.Timer.Check = -1
        end
        return
    end

    for aIndex = 13000, 13999 do
        if gObjIsConnectedGP(aIndex) == 0 then goto segue end

        local player = User.new(aIndex)
        local nome = player:getName()
        if MataMata.CheckIfIsPlayer(nome) then
            if MataMata.Lutando[1].Info[1] == nome or MataMata.Lutando[2].Info[1] == nome then goto segue end

            local map = player:getMapNumber()
            local x = player:getX()
            local y = player:getY()
            local intruder = false
            for a = 1, 2 do
                local area = MataMata_Config.Area[a].PvP
                if map == area.Map then
                    if x >= area.X1 and x <= area.X2 and y >= area.Y1 and y <= area.Y2 then
                        intruder = true
                    end
                end
            end

            if intruder then
                local intruderCount = MataMata.GetIntruderCount(nome)
                if intruderCount >= 5 then
                    MataMata.RemoverPlayer(nome)
                else
                    intruderCount = intruderCount+1
                    MataMata.SetIntruderCount(nome, intruderCount)
                end
            else
                MataMata.SetIntruderCount(nome, 0)
            end
        end

        ::segue::
    end
end

function MataMata.EnterCharacter(aIndex)
    if not MataMata.Status.Running then return end

    local player = User.new(aIndex)
    local name = player:getName()
    if not MataMata_Config.LogoutExitEvent then
        local was, fase = MataMata.CheckIfWasPlayer(name)
        if was then
            if fase == MataMata.Fase then
                for i in ipairs(MataMata.Participantes) do
                    if not MataMata.Participantes[i].Active and not MataMata.Participantes[i].Removed then
                        if MataMata.Participantes[i].Info[1] == name then
                            MataMata.Participantes[i].Active = true
                        end
                    end
                end
            else
                for i in ipairs(MataMata.Participantes) do
                    if not MataMata.Participantes[i].Active and not MataMata.Participantes[i].Removed then
                        if MataMata.Participantes[i].Info[1] == name then
                            MataMata.Participantes[i].Removed = true
                            Teleport(aIndex, 0, 125, 125)
                        end
                    end
                end
            end
        end
    end
end

function MataMata.PlayerLogout(aIndex, Name, Account)
    if not MataMata.Status.Running then return end
	if MataMata.GMIndex ~= -1 then
		if MataMata.GMIndex == aIndex then
			MataMata.GMIndex = -1
		end
	end
    if MataMata.CheckIfIsPlayer(Name) then
        for i in ipairs(MataMata.Participantes) do
            if MataMata.Participantes[i] ~= nil then
                if MataMata.Participantes[i].Active then
                    if MataMata.Participantes[i].Info[1] == Name then
                        if MataMata.Participantes[i].Lutando then
                            local vencedor = {}
                            local perdedor = {}

                            if MataMata.Lutando[1].Info[1] == Name then
                                perdedor = MataMata.Lutando[1]
                                vencedor = MataMata.Lutando[2]
                            else
                                perdedor = MataMata.Lutando[2]
                                vencedor = MataMata.Lutando[1]
                            end
                            MataMata.Participantes[i].Active = false
                            MataMata.Participantes[i].Removed = true
                            MataMata.WinByDefault(vencedor.Info[2], perdedor.Info[2])
                        else
                            if MataMata_Config.LogoutExitEvent then
                                Teleport(aIndex, 0, 125, 125)
                                MataMata.Participantes[i].Removed = true
                            end
                            MataMata.Participantes[i].Active = false
                        end
                    end
                end
            end
        end
    end
end

function MataMata.WinByDefault(aIndex, bIndex)
    if aIndex ~= MataMata.Lutando[1].Info[2] and bIndex ~= MataMata.Lutando[1].Info[2] then return end
    local vencedor = {}
    local perdedor = {}

    if aIndex == MataMata.Lutando[1].Info[2] then
        MataMata.Lutando[1].Placar = MataMata.Lutando[1].Placar + 1
        vencedor = MataMata.Lutando[1]
        perdedor = MataMata.Lutando[2]
    end
    
    if aIndex == MataMata.Lutando[2].Info[2] then
        MataMata.Lutando[2].Placar = MataMata.Lutando[2].Placar + 1
        vencedor = MataMata.Lutando[2]
        perdedor = MataMata.Lutando[1]
    end

    MataMata.Status.Luta = false

    --#region CONTADOR DA MORTE
    if gObjIsConnectedGP(aIndex) > 0 then
        local aInv = Inventory.new(aIndex)
        local aWeapon = aInv:getIndex(0)

        if MataMata_Config.CounterItem[aWeapon] ~= nil then
            if MataMata_Config.Version >= 6 then
                InsertCounter(aIndex, 0, MataMata_Config.CounterItem[aWeapon].Add)
	            UpdateCounter(aIndex)
            else
                InsertDeath(aIndex, 0, MataMata_Config.CounterItem[aWeapon].Add)
	            UpdateDeath(aIndex)
            end
        end
    end
    --#endregion

    local player = User.new(vencedor.Info[2])
    local guild = player:getGuildName()
    if guild ~= nil and type(guild) == "string" and guild:len() > 0 then
        Message.SendMessageGlobalMultLangArgs(MataMata_Config.Message, 26, 0, vencedor.Info[1], guild)
    else
        Message.SendMessageGlobalMultLangArgs(MataMata_Config.Message, 21, 0, vencedor.Info[1])
    end

    if MataMata.Fase < MataMata.SemiFinal then    
        for i in ipairs(MataMata.Participantes) do
            if MataMata.Participantes[i].Lutando and MataMata.Participantes[i].Info[1] == vencedor.Info[1] then
                MataMata.Participantes[i].Lutando = false
                MataMata.Participantes[i].Fase = MataMata.Participantes[i].Fase + 1
                if MataMata.CurrentArea == 1 then
                    MataMata.MovePlayer(2, vencedor.Info)
                else
                    MataMata.MovePlayer(1, vencedor.Info)
                end
            end

            if MataMata.Participantes[i].Lutando and MataMata.Participantes[i].Info[1] == perdedor.Info[1] then
                MataMata.Participantes[i].Lutando = false
                MataMata.Participantes[i].Active = false
                MataMata.Participantes[i].Removed = true
                MataMata.MoverParaLorencia(perdedor.Info)
            end
        end

        Timer.TimeOut(2, MataMata.Chamar, 1)
        return
    end

    if MataMata.Fase == MataMata.SemiFinal then
        for i in ipairs(MataMata.Participantes) do
            if MataMata.Participantes[i].Lutando and MataMata.Participantes[i].Info[1] == vencedor.Info[1] then
                MataMata.Participantes[i].Lutando = false
                MataMata.Participantes[i].Fase = MataMata.Participantes[i].Fase + 1
                if MataMata.CurrentArea == 1 then
                    MataMata.MovePlayer(2, vencedor.Info)
                else
                    MataMata.MovePlayer(1, vencedor.Info)
                end
            end

            if MataMata.Participantes[i].Lutando and MataMata.Participantes[i].Info[1] == perdedor.Info[1] then
                MataMata.Participantes[i].Lutando = false
                MataMata.Participantes[i].Active = false
                MataMata.Participantes[i].Removed = true     
                MataMata.Participantes[i].Pos = 3
                table.insert(MataMata.Vencedores, MataMata.Participantes[i])
                MataMata.MoverParaLorencia(perdedor.Info)
                SendMessage(string.format(MataMata_Config.Message[perdedor.Info[3]][32], 3), perdedor.Info[2], 1)
            end
        end

        Timer.TimeOut(2, MataMata.Chamar, 1)
    end

    if MataMata.Fase == MataMata.Final then
        for i in ipairs(MataMata.Participantes) do
            if MataMata.Participantes[i].Lutando and MataMata.Participantes[i].Info[1] == vencedor.Info[1] then
                MataMata.Participantes[i].Lutando = false
                MataMata.Participantes[i].Active = false
                MataMata.Participantes[i].Removed = true     
                MataMata.Participantes[i].Pos = 1
                table.insert(MataMata.Vencedores, MataMata.Participantes[i])
                MataMata.MoverParaLorencia(vencedor.Info)
                SendMessage(string.format(MataMata_Config.Message[vencedor.Info[3]][32], 1), vencedor.Info[2], 1)
            end

            if MataMata.Participantes[i].Lutando and MataMata.Participantes[i].Info[1] == perdedor.Info[1] then
                MataMata.Participantes[i].Lutando = false
                MataMata.Participantes[i].Active = false
                MataMata.Participantes[i].Removed = true     
                MataMata.Participantes[i].Pos = 2
                table.insert(MataMata.Vencedores, MataMata.Participantes[i])
                MataMata.MoverParaLorencia(perdedor.Info)
                SendMessage(string.format(MataMata_Config.Message[perdedor.Info[3]][32], 2), perdedor.Info[2], 1)
            end
        end

        MataMata.Finalizar()
        return
    end
end

function MataMata.PlayerAttack(aIndex, bIndex)
    if not MataMata.Status.Started then return 0 end

    if MataMata.Lutando[1].Info ~= nil and MataMata.Lutando[2].Info ~= nil then
        if aIndex == MataMata.Lutando[1].Info[2] or bIndex == MataMata.Lutando[1].Info[2] then
            if MataMata.Status.Luta then return 0 else return 1 end
        end

        if aIndex == MataMata.Lutando[2].Info[2] or bIndex == MataMata.Lutando[2].Info[2] then
            if MataMata.Status.Luta then return 0 else return 1 end
        end
    end

    return 0
end

function MataMata.PlayerDie(aIndex, bIndex)
    if not MataMata.Status.Started then return end

    if aIndex ~= MataMata.Lutando[1].Info[2] and bIndex ~= MataMata.Lutando[1].Info[2] then return end
    local vencedor = {}
    local perdedor = {}

    if aIndex == MataMata.Lutando[1].Info[2] then
        MataMata.Lutando[1].Placar = MataMata.Lutando[1].Placar + 1
        vencedor = MataMata.Lutando[1]
        perdedor = MataMata.Lutando[2]
    end
    
    if aIndex == MataMata.Lutando[2].Info[2] then
        MataMata.Lutando[2].Placar = MataMata.Lutando[2].Placar + 1
        vencedor = MataMata.Lutando[2]
        perdedor = MataMata.Lutando[1]
    end

    MataMata.Status.Luta = false

    --#region CONTADOR DA MORTE
    if gObjIsConnectedGP(aIndex) > 0 then
        local aInv = Inventory.new(aIndex)
        local aWeapon = aInv:getIndex(0)

        if MataMata_Config.CounterItem[aWeapon] ~= nil then
            if MataMata_Config.Version >= 6 then
                InsertCounter(aIndex, 0, MataMata_Config.CounterItem[aWeapon].Add)
	            UpdateCounter(aIndex)
            else
                InsertDeath(aIndex, 0, MataMata_Config.CounterItem[aWeapon].Add)
	            UpdateDeath(aIndex)
            end
        end
    end

    if gObjIsConnectedGP(bIndex) > 0 then
        local bInv = Inventory.new(bIndex)
        local bWeapon = bInv:getIndex(0)
        local bSerial = bInv:getSerial(0)

        if MataMata_Config.CounterItem[bWeapon] ~= nil then
            local remover = MataMata_Config.CounterItem[bWeapon].Remove
            local mortes = DataBase.GetNumberByNumber("DeathSystem", "Deaths", "m_Serial", bSerial)
            if mortes < remover then remover = mortes end
            if MataMata_Config.Version >= 6 then
                DecreaseCounter(bIndex, 0, remover)
	            UpdateCounter(bIndex)
            else
                DecreaseDeath(bIndex, 0, remover)
	            UpdateDeath(bIndex)
            end
        end
    end
    --#endregion

    local totalrounds = 1
    if MataMata.Fase < MataMata.SemiFinal then
        totalrounds = MataMata_Config.Rounds.Normal
    end

    if MataMata.Fase == MataMata.SemiFinal then
        totalrounds = MataMata_Config.Rounds.Semi
    end

    if MataMata.Fase == MataMata.Final then
        totalrounds = MataMata_Config.Rounds.Final
    end

    if totalrounds > 1 then
        local precisaparavencer = math.ceil(totalrounds/2)    
        if vencedor.Placar < precisaparavencer then
            Message.SendMessageGlobalMultLang(MataMata_Config.Message, 11, 0)
            SendMessageGlobal("", 0)
            Message.SendMessageGlobalMultLangArgs(MataMata_Config.Message, 31, 0, MataMata.Lutando[1].Info[1], MataMata.Lutando[1].Placar, MataMata.Lutando[2].Placar, MataMata.Lutando[2].Info[1])
            SendMessageGlobal("", 0)
            Message.SendMessageGlobalMultLang(MataMata_Config.Message, 11, 0)
            MataMata.CurrentRound = MataMata.CurrentRound + 1
            Timer.TimeOut(MataMata_Config.RoundDelay, MataMata.Contar, 4)
            return
        end
    end

    local player = User.new(vencedor.Info[2])
    local guild = player:getGuildName()
    if guild ~= nil and type(guild) == "string" and guild:len() > 0 then
        Message.SendMessageGlobalMultLangArgs(MataMata_Config.Message, 26, 0, vencedor.Info[1], guild)
    else
        Message.SendMessageGlobalMultLangArgs(MataMata_Config.Message, 21, 0, vencedor.Info[1])
    end

    if MataMata.Fase < MataMata.SemiFinal then    
        for i in ipairs(MataMata.Participantes) do
            if MataMata.Participantes[i].Lutando and MataMata.Participantes[i].Info[1] == vencedor.Info[1] then
                MataMata.Participantes[i].Lutando = false
                MataMata.Participantes[i].Placar = 0
                MataMata.Participantes[i].Fase = MataMata.Participantes[i].Fase + 1
                if MataMata.CurrentArea == 1 then
                    MataMata.MovePlayer(2, vencedor.Info)
                else
                    MataMata.MovePlayer(1, vencedor.Info)
                end
            end

            if MataMata.Participantes[i].Lutando and MataMata.Participantes[i].Info[1] == perdedor.Info[1] then
                MataMata.Participantes[i].Lutando = false
                MataMata.Participantes[i].Active = false
                MataMata.Participantes[i].Removed = true
                MataMata.MoverParaLorencia(perdedor.Info)
            end
        end

        Timer.TimeOut(2, MataMata.Chamar)
        return
    end

    if MataMata.Fase == MataMata.SemiFinal then
        for i in ipairs(MataMata.Participantes) do
            if MataMata.Participantes[i].Lutando and MataMata.Participantes[i].Info[1] == vencedor.Info[1] then
                MataMata.Participantes[i].Lutando = false
                MataMata.Participantes[i].Placar = 0
                MataMata.Participantes[i].Fase = MataMata.Participantes[i].Fase + 1
                if MataMata.CurrentArea == 1 then
                    MataMata.MovePlayer(2, vencedor.Info)
                else
                    MataMata.MovePlayer(1, vencedor.Info)
                end
            end

            if MataMata.Participantes[i].Lutando and MataMata.Participantes[i].Info[1] == perdedor.Info[1] then
                MataMata.Participantes[i].Lutando = false
                MataMata.Participantes[i].Active = false
                MataMata.Participantes[i].Removed = true     
                MataMata.Participantes[i].Pos = 3
                table.insert(MataMata.Vencedores, MataMata.Participantes[i])
                MataMata.MoverParaLorencia(perdedor.Info)
                SendMessage(string.format(MataMata_Config.Message[perdedor.Info[3]][33], 3), perdedor.Info[2], 1)
            end
        end

        Timer.TimeOut(2, MataMata.Chamar)
    end

    if MataMata.Fase == MataMata.Final then
        for i in ipairs(MataMata.Participantes) do
            if MataMata.Participantes[i].Lutando and MataMata.Participantes[i].Info[1] == vencedor.Info[1] then
                MataMata.Participantes[i].Lutando = false
                MataMata.Participantes[i].Active = false
                MataMata.Participantes[i].Removed = true     
                MataMata.Participantes[i].Pos = 1
                table.insert(MataMata.Vencedores, MataMata.Participantes[i])
                MataMata.MoverParaLorencia(vencedor.Info)
                SendMessage(string.format(MataMata_Config.Message[vencedor.Info[3]][33], 1), vencedor.Info[2], 1)
            end

            if MataMata.Participantes[i].Lutando and MataMata.Participantes[i].Info[1] == perdedor.Info[1] then
                MataMata.Participantes[i].Lutando = false
                MataMata.Participantes[i].Active = false
                MataMata.Participantes[i].Removed = true     
                MataMata.Participantes[i].Pos = 2
                table.insert(MataMata.Vencedores, MataMata.Participantes[i])
                MataMata.MoverParaLorencia(perdedor.Info)
                SendMessage(string.format(MataMata_Config.Message[perdedor.Info[3]][33], 2), perdedor.Info[2], 1)
            end
        end

        MataMata.Finalizar()
        return
    end
end

function MataMata.CommandOpen(aIndex, Arguments)
    local player = User.new(aIndex)

    if player:getAuthority() <= 1 then return end

    local lang = player:getLanguage()

    if MataMata.Status.Running then
        SendMessage(string.format(MataMata_Config.Message[lang][1], MataMata_Config.Command[lang].Cancel), aIndex, 1)
        return
    end

    local t = command:getNumber(Arguments, 1)

    if t == nil or t < 5 then
        SendMessage(string.format(MataMata_Config.Message[lang][2], MataMata_Config.Command[lang].Open), aIndex, 1)
        return
    end

    MataMata.EventType = 0

    local tipo = command:getNumber(Arguments, 2)

    if tipo > 0 then
        if MataMata_Config.Types[tipo] == nil then
            SendMessage(MataMata_Config.Message[lang][27], aIndex, 1)
            return
        end

        MataMata.EventType = tipo
    end
    
    MataMata.Counter.Open = t

    MataMata.Status.Running = true
    MataMata.Status.Open = true

    Message.SendMessageGlobalMultLang(MataMata_Config.Message, 3, 1)
    if MataMata.EventType > 0 then
        Message.SendMessageGlobalMultLang(MataMata_Config.Message, MataMata_Config.Types[MataMata.EventType].Name, 0)
    else
        Message.SendMessageGlobalMultLang(MataMata_Config.Message, 4, 0)
    end
    MataMata.Timer.Open = Timer.Repeater(1, t, MataMata.AnnounceEventOpen)
    MataMata.Timer.CheckEvent = Timer.Interval(1, MataMata.CheckEvent)
    MataMata.Timer.CheckPvPArea = Timer.Interval(1, MataMata.CheckPvPArea)
    local area =  MataMata_Config.Area[MataMata.CurrentArea].Watch
    MataMata.GMIndex = aIndex
    Teleport(aIndex, area.Map, area.X, area.Y)
end

function MataMata.AnnounceEventOpen()
    if MataMata.Counter.Open <= 0 then
        MataMata.Status.Open = false

        if MataMata.CountPlayers(MataMata.Fase) < 4 then
            for i in ipairs(MataMata.Participantes) do
                if MataMata.Participantes[i].Active then
                    Teleport(MataMata.Participantes[i].Info[2], 0, 125, 125)
                end
            end

            if MataMata.Timer.CheckEvent ~= -1 then
                Timer.Cancel(MataMata.Timer.CheckEvent)
            end
        
            if MataMata.Timer.CheckPvPArea ~= -1 then
                Timer.Cancel(MataMata.Timer.CheckPvPArea)
            end

            Message.SendMessageGlobalMultLang(MataMata_Config.Message, 11, 0)
            SendMessageGlobal("", 0)
            Message.SendMessageGlobalMultLang(MataMata_Config.Message, 17, 0)
            SendMessageGlobal("", 0)
            Message.SendMessageGlobalMultLang(MataMata_Config.Message, 11, 0)

            MataMata.Define()
            return
        end

        if MataMata.CountPlayers(MataMata.Fase) == 4 then
            MataMata.Fase = MataMata.SemiFinal
            for i in ipairs(MataMata.Participantes) do
                if MataMata.Participantes[i].Active then
                    MataMata.Participantes[i].Fase = MataMata.SemiFinal
                end
            end
        end

        MataMata.Status.Started = true
        if MataMata.Fase < 200 then
            MataMata.AnunciarFaseNumerica(MataMata.Fase)
        else
            Message.SendMessageGlobalMultLang(MataMata_Config.Message, 11, 0)
            SendMessageGlobal("", 0)
            Message.SendMessageGlobalMultLang(MataMata_Config.Message, 24, 0)
            SendMessageGlobal("", 0)
            Message.SendMessageGlobalMultLang(MataMata_Config.Message, 11, 0)
        end
        Timer.TimeOut(3, MataMata.Chamar)
    else
        if MataMata.Counter.Open > 1 then
            MataMata.SendMessageOpen(5, MataMata.Counter.Open)
        else
            MataMata.SendMessageOpen(6, MataMata.Counter.Open)
        end
        MataMata.Counter.Open = MataMata.Counter.Open - 1
    end
end

function MataMata.AnunciarFaseNumerica(fase)
    Message.SendMessageGlobalMultLang(MataMata_Config.Message, 11, 0)
    SendMessageGlobal("", 0)
    Message.SendMessageGlobalMultLangArgs(MataMata_Config.Message, 16, 0, fase)
    SendMessageGlobal("", 0)
    Message.SendMessageGlobalMultLang(MataMata_Config.Message, 11, 0)
end

function MataMata.Chamar(tipo)
    if tipo ~= nil and tipo == 1 then
        if MataMata.CountPlayers(MataMata.Fase) <= 2 then
            for i in ipairs(MataMata.Participantes) do
                if MataMata.Participantes[i].Active and not MataMata.Participantes[i].Lutando then
                    if MataMata.Fase < 201 then
                        if MataMata.Participantes[i].Fase == MataMata.Fase then
                            MataMata.Participantes[i].Fase = MataMata.Fase+1
                            if MataMata.CurrentArea == 1 then
                                MataMata.MovePlayer(2, MataMata.Participantes[i].Info)
                            else
                                MataMata.MovePlayer(1, MataMata.Participantes[i].Info)
                            end
                            Message.SendMessageGlobalMultLangArgs(MataMata_Config.Message, 15, 0, MataMata.Participantes[i].Info[1])
                        end
                    end
                end
            end
        end
        Timer.TimeOut(3, MataMata.MudarFase)
        return
    end

    if MataMata.CountPlayers(MataMata.Fase) < 2 then     
            for i in ipairs(MataMata.Participantes) do
                if MataMata.Participantes[i].Active and not MataMata.Participantes[i].Lutando then
                    if MataMata.Fase < 201 then
                        if MataMata.Participantes[i].Fase == MataMata.Fase then
                            MataMata.Participantes[i].Fase = MataMata.Fase+1
                            if MataMata.CurrentArea == 1 then
                                MataMata.MovePlayer(2, MataMata.Participantes[i].Info)
                            else
                                MataMata.MovePlayer(1, MataMata.Participantes[i].Info)
                            end
                            Message.SendMessageGlobalMultLangArgs(MataMata_Config.Message, 15, 0, MataMata.Participantes[i].Info[1])
                        end
                    end
                end
            end
            Timer.TimeOut(3, MataMata.MudarFase)
    else
        local totalrounds = 1
        if MataMata.Fase < MataMata.SemiFinal then
            totalrounds = MataMata_Config.Rounds.Normal
        end

        if MataMata.Fase == MataMata.SemiFinal then
            totalrounds = MataMata_Config.Rounds.Semi
        end

        if MataMata.Fase == MataMata.Final then
            totalrounds = MataMata_Config.Rounds.Final
        end

        local p1 = MataMata.PickPlayer(MataMata.Fase)
        local p2 = MataMata.PickPlayer(MataMata.Fase)

        if MataMata.EventType > 0 then
            if MataMata_Config.Types[MataMata.EventType].AllowedItem > 0 then
                if MataMata_Config.AllowedItens[MataMata_Config.Types[MataMata.EventType].AllowedItem] ~= nil then
                    while not MataMata.CheckAllowedItens(p1.Info[2], MataMata_Config.Types[MataMata.EventType].AllowedItem) do
                        MataMata.RemoverPlayer(p1.Info[1])
                        p1 = MataMata.PickPlayer(MataMata.Fase)
                    end

                    while not MataMata.CheckAllowedItens(p2.Info[2],MataMata_Config.Types[MataMata.EventType].AllowedItem) do
                        MataMata.RemoverPlayer(p2.Info[1])
                        p2 = MataMata.PickPlayer(MataMata.Fase)
                    end
                end
            end
        end

        MataMata.Lutando[1] = p1
        MataMata.Lutando[2] = p2

        Message.SendMessageGlobalMultLang(MataMata_Config.Message, 11, 0)
        Message.SendMessageGlobalMultLangArgs(MataMata_Config.Message, 12, 0, p1.Info[1])
        Message.SendMessageGlobalMultLang(MataMata_Config.Message, 13, 0)
        Message.SendMessageGlobalMultLangArgs(MataMata_Config.Message, 12, 0, p2.Info[1])
        if totalrounds > 1 then
            Message.SendMessageGlobalMultLangArgs(MataMata_Config.Message, 32, 0, totalrounds)
        else
            Message.SendMessageGlobalMultLang(MataMata_Config.Message, 11, 0)
        end
        Teleport(p1.Info[2], MataMata_Config.Area[MataMata.CurrentArea].Spot[1].Map, MataMata_Config.Area[MataMata.CurrentArea].Spot[1].X, MataMata_Config.Area[MataMata.CurrentArea].Spot[1].Y)
        Teleport(p2.Info[2], MataMata_Config.Area[MataMata.CurrentArea].Spot[2].Map, MataMata_Config.Area[MataMata.CurrentArea].Spot[2].X, MataMata_Config.Area[MataMata.CurrentArea].Spot[2].Y)
        MataMata.CurrentRound = 1
        Timer.TimeOut(2, MataMata.Contar, 4)
    end
end

function MataMata.Contar(n)
    if n == 4 then
        if MataMata_Config.Version >= 6 then
            if MataMata_Config.RemoveBuffBeforeFight then
                ClearAllBuff(MataMata.Lutando[1].Info[2])
                ClearAllBuff(MataMata.Lutando[2].Info[2])
            end
        end

        Message.SendMessageGlobalMultLang(MataMata_Config.Message, 18, 0)
        n = n-1
        Timer.TimeOut(2, MataMata.Contar, n)
        return
    end

    if n == 0 then
        Message.SendMessageGlobalMultLang(MataMata_Config.Message, 19, 0)
        MataMata.Status.Luta = true
        return
    end
    Message.SendMessageGlobalMultLangArgs(MataMata_Config.Message, 20, 0, n)
    n = n-1
    Timer.TimeOut(1, MataMata.Contar, n)
end

function MataMata.Finalizar()
    local vencedor = {
        [1] = {},
        [2] = {},
        [3] = {},
    }

    if MataMata.Timer.CheckEvent ~= -1 then
        Timer.Cancel(MataMata.Timer.CheckEvent)
    end

    if MataMata.Timer.CheckPvPArea ~= -1 then
        Timer.Cancel(MataMata.Timer.CheckPvPArea)
    end

    for i in ipairs(MataMata.Vencedores) do
        vencedor[MataMata.Vencedores[i].Pos] = MataMata.Vencedores[i]
    end

    Message.SendMessageGlobalMultLang(MataMata_Config.Message, 35, 1)
    Message.SendMessageGlobalMultLang(MataMata_Config.Message, 4, 0)
    Message.SendMessageGlobalMultLang(MataMata_Config.Message, 22, 0)
    Message.SendMessageGlobalMultLangArgs(MataMata_Config.Message, 23, 0, 1, vencedor[1].Info[1])
    Message.SendMessageGlobalMultLangArgs(MataMata_Config.Message, 23, 0, 2, vencedor[2].Info[1])
    Message.SendMessageGlobalMultLangArgs(MataMata_Config.Message, 23, 0, 3, vencedor[3].Info[1])
    Message.SendMessageGlobalMultLang(MataMata_Config.Message, 11, 0)

    for w = 1, 3 do
        for i in ipairs(MataMata_Config.Prize[w]) do
            local coin = MataMata_Config.Prize[w][i]
            DataBaseAsync.SetAddValue(coin.Table, coin.Column, coin.Amount, coin.Where, vencedor[w].Info[coin.IdType])
			 if coin.Announce then
                SendMessage(string.format(MataMata_Config.Message[vencedor[w].Info[3]][34], coin.Amount, coin.Name), vencedor[w].Info[2], 1)		
            end
        end
    end

    if PvPExtra and vencedor[1].Info then PvPExtra.Entregar(vencedor[1].Info[1], 'Campeao do Mata-Mata') end -- premio exclusivo sem repetir
    MataMata.Define()
end

function MataMata.MovePlayer(area, player)
    Teleport(player[2], MataMata_Config.Area[area].Respawn.Map, MataMata_Config.Area[area].Respawn.X, MataMata_Config.Area[area].Respawn.Y)
end

function MataMata.MoverParaLorencia(player)
    Teleport(player[2], 0, 125, 125)
end

function MataMata.RemoverPlayer(Name)
    for i in ipairs(MataMata.Participantes) do
        if MataMata.Participantes[i].Active then
            if MataMata.Participantes[i].Info[1] == Name then
                MataMata.Participantes[i].Active = false
                MataMata.Participantes[i].Removed = true
                MataMata.MoverParaLorencia(MataMata.Participantes[i].Info)
                SendMessage(MataMata_Config.Message[MataMata.Participantes[i].Info[3]][36], MataMata.Participantes[i].Info[2], 1)
            end
        end
    end
end

function MataMata.MudarFase()
    local tempfase = MataMata.Fase+1

    local quatidadeDePlayersNaFase = MataMata.CountPlayers(tempfase)

    if quatidadeDePlayersNaFase > 4 then
        MataMata.Fase = MataMata.Fase + 1
        MataMata.AnunciarFaseNumerica(MataMata.Fase)
    end

    if quatidadeDePlayersNaFase >= 3 and quatidadeDePlayersNaFase <= 4 then
        for i in ipairs(MataMata.Participantes) do
            if MataMata.Participantes[i].Active and not MataMata.Participantes[i].Lutando then
                if MataMata.Participantes[i].Fase == MataMata.Fase or MataMata.Participantes[i].Fase == tempfase then
                    MataMata.Participantes[i].Fase = MataMata.SemiFinal
                end
            end
        end
        
        MataMata.Fase = MataMata.SemiFinal
        Message.SendMessageGlobalMultLang(MataMata_Config.Message, 11, 0)
        SendMessageGlobal("", 0)
        Message.SendMessageGlobalMultLang(MataMata_Config.Message, 24, 0)
        SendMessageGlobal("", 0)
        Message.SendMessageGlobalMultLang(MataMata_Config.Message, 11, 0)
    end

    if quatidadeDePlayersNaFase == 2 then
        for i in ipairs(MataMata.Participantes) do
            if MataMata.Participantes[i].Active and not MataMata.Participantes[i].Lutando then
                if MataMata.Participantes[i].Fase == MataMata.Fase or  MataMata.Participantes[i].Fase == tempfase then
                    MataMata.Participantes[i].Fase = MataMata.Final
                end
            end
        end
        
        MataMata.Fase = MataMata.Final
        Message.SendMessageGlobalMultLang(MataMata_Config.Message, 11, 0)
        SendMessageGlobal("", 0)
        Message.SendMessageGlobalMultLang(MataMata_Config.Message, 14, 0)
        SendMessageGlobal("", 0)
        Message.SendMessageGlobalMultLang(MataMata_Config.Message, 11, 0)
    end


    if MataMata.CurrentArea == 1 then MataMata.CurrentArea = 2 else MataMata.CurrentArea = 1 end
    if MataMata.GMIndex ~= -1 then
        local area =  MataMata_Config.Area[MataMata.CurrentArea].Watch
        Teleport(MataMata.GMIndex, area.Map, area.X, area.Y)
    end
    Timer.TimeOut(3, MataMata.Chamar)
end

function MataMata.CommandCancel(aIndex)
    local player = User.new(aIndex)

    if player:getAuthority()  <= 1 then return end

    local lang = player:getLanguage()

    if not MataMata.Status.Running then
        SendMessage(string.format(MataMata_Config.Message[lang][7], MataMata_Config.Command[lang].Open), aIndex, 1)
        return
    end

    if MataMata.Timer.Open ~= -1 then
        Timer.Cancel(MataMata.Timer.Open)
        MataMata.Timer.Open = -1
    end

     if MataMata.Timer.CheckEvent ~= -1 then
        Timer.Cancel(MataMata.Timer.CheckEvent)
    end

    if MataMata.Timer.CheckPvPArea ~= -1 then
        Timer.Cancel(MataMata.Timer.CheckPvPArea)
    end

    for i in ipairs(MataMata.Participantes) do
        if MataMata.Participantes[i].Active then
            Teleport(MataMata.Participantes[i].Info[2], 0, 125, 125)
        end
    end

    Message.SendMessageGlobalMultLang(MataMata_Config.Message, 8, 1)
    Message.SendMessageGlobalMultLang(MataMata_Config.Message, 8, 0)

    MataMata.Define()
end

function MataMata.SendMessageOpen(key, t)
	for i = OBJECT_START_USER, MAX_OBJECT
	do
		if gObjIsConnectedGP(i) == 0
		then
			goto continue
		end
        local lang = GetLanguageObject(i)
		SendMessagePlayer(i, 0, string.format(MataMata_Config.Message[lang][key], MataMata_Config.Command[lang].Go, t))
		
		::continue::
	end
	
	collectgarbage()
end

function MataMata.CommandGo(aIndex)
    local player = User.new(aIndex)
    local playerInfo = {[0] = player:getAccountID(), [1] = player:getName(), [2] = aIndex, [3] = player:getLanguage()}

    if not MataMata.Status.Open then
        SendMessage(MataMata_Config.Message[playerInfo[3]][9], aIndex, 1)
        return
    end

    if MataMata.EventType > 0 then
		local eventconfig = MataMata_Config.Types[MataMata.EventType]
        if eventconfig.AllowedClass > 0 then
            local class = player:getClass()

            if MataMata_Config.AllowedClasses[eventconfig.AllowedClass] ~= nil then
                if not MataMata_Config.AllowedClasses[eventconfig.AllowedClass][class] then
                    SendMessage(MataMata_Config.Message[playerInfo[3]][28], aIndex, 1)
                    return
                end
            end
        end

        if eventconfig.AllowedItem > 0 then
            if MataMata_Config.AllowedItens[eventconfig.AllowedItem] ~= nil then
                if not MataMata.CheckAllowedItens(aIndex, eventconfig.AllowedItem) then
                    SendMessage(MataMata_Config.Message[playerInfo[3]][29], aIndex, 1)
                    return
                end
            end
        end

        if eventconfig.Invite > 0 then
            if MataMata_Config.Invite[eventconfig.Invite] ~= nil then
                if not MataMata.CollectInvite(aIndex, eventconfig.Invite) then
                    SendMessage(MataMata_Config.Message[playerInfo[3]][30], aIndex, 1)
                    return
                end
            end
        end
    end
    
    MataMata.MovePlayer(MataMata.CurrentArea, playerInfo)

    if not MataMata.CheckIfIsPlayer(playerInfo[1]) then
        local temp = {Active = true, Lutando = false, Pos = 0, Intruder = 0, Placar = 0, Removed = false, Fase = MataMata.Fase, Info = playerInfo}
        table.insert(MataMata.Participantes, temp)
    end

    SendMessage(MataMata_Config.Message[playerInfo[3]][10], aIndex, 1)
end

function MataMata.CollectInvite(aIndex, InviteId)
    local pInv = Inventory.new(aIndex)
    local invite = GET_ITEM(MataMata_Config.Invite[InviteId].Section, MataMata_Config.Invite[InviteId].Index)
    local inviteCount = GetInventoryItemCount(aIndex, invite, MataMata_Config.Invite[InviteId].Level)
    
    if inviteCount < MataMata_Config.Invite[InviteId].Amount then
        return false
    end

    DeleteItemCount(aIndex, invite, MataMata_Config.Invite[InviteId].Level, MataMata_Config.Invite[InviteId].Amount)

    return true
end

function MataMata.CheckAllowedItens(aIndex, AllowedItem)
    local pInv = Inventory.new(aIndex)
    local allowed = true
    for slot = 0, 11 do
        if pInv:isItem(slot) ~= 0 then
            local isItemList = false
            for i in ipairs(MataMata_Config.AllowedItens[AllowedItem]) do
                local item = MataMata_Config.AllowedItens[AllowedItem][i]
                local itemTable = Utils.InventoryGetItemTable(aIndex, slot)
                if GET_ITEM(itemTable.Section, itemTable.Index) == GET_ITEM(item.Section, item.Index) then
                    if item.MaxLevel < 15 then
                        if itemTable.Level > item.MaxLevel then
                            break
                        end
                    end

                    if item.Skill < 1 then
                        if itemTable.Skill == 1 then
                            break
                        end
                    end

                    if item.Luck < 1 then
                        if itemTable.Luck == 1 then
                            break
                        end
                    end

                    if item.MaxOpt < 7 then
                        if itemTable.Option > item.MaxOpt then
                            break
                        end
                    end

                    if item.MaxExc < 6 then
                        local excT = itemTable.Exc
                        local excCount = 0
                        for e = 1, 6 do
                            if excT[e] == 1 then
                                excCount = excCount + 1
                            end
                        end
                        if excCount > item.MaxExc then
                            break
                        end
                    end

                    if item.Ancient < 2 then
                        if itemTable.Ancient > item.Ancient then
                            break
                        end
                    end

                    isItemList = true
                end
            end

            if not isItemList then
                allowed = false
                break
            end
        end
    end

    if allowed then
		if MataMata_Config.Version == 6 then
			for slot = 236, 239 do
				if pInv:isItem(slot) then
					local isItemList = false
					for i in ipairs(MataMata_Config.AllowedItens[AllowedItem]) do
						local item = MataMata_Config.AllowedItens[AllowedItem][i]
						if pInv:getIndex(slot) == GET_ITEM(item.Section, item.Index) then
							isItemList = true
						end
					end
	
					if not isItemList then
						allowed = false
						break
					end
				end
			end
		else
			local pElementSlot = ElementSlot.new(aIndex)
			for slot = 0, 1 do
				if pElementSlot:isItem(slot) ~= 0 then
					local isItemList = false
					for i in ipairs(MataMata_Config.AllowedItens[AllowedItem]) do
						local item = MataMata_Config.AllowedItens[AllowedItem][i]
						if pElementSlot:getIndex(slot) == GET_ITEM(item.Section, item.Index) then
							isItemList = true
						end
					end
	
					if not isItemList then
						allowed = false
						break
					end
				end
			end
		end
    end

    return allowed
end

function MataMata.PickPlayer(fase)
    local players = {}
    for i in ipairs(MataMata.Participantes) do
        if MataMata.Participantes[i].Fase == fase then
            if MataMata.Participantes[i].Active and not MataMata.Participantes[i].Lutando then
                table.insert(players, MataMata.Participantes[i])
            end
        end
    end

    local player = players[Utils.GetRandom(1, #players, math.random(1,10))]

    for i in ipairs(MataMata.Participantes) do
        if MataMata.Participantes[i].Active then
            if MataMata.Participantes[i].Fase == fase then
                if MataMata.Participantes[i].Info[1] == player.Info[1] then
                    MataMata.Participantes[i].Lutando = true
                end
            end
        end
    end

    return player
end

function MataMata.CheckIfIsPlayer(Name)
    if #MataMata.Participantes == 0 then return false end

    for i in ipairs(MataMata.Participantes) do
        if MataMata.Participantes[i].Active then
            if MataMata.Participantes[i].Info[1] == Name then
                return true
            end
        end
    end

    return false
end

function MataMata.GetIntruderCount(Name)
    if #MataMata.Participantes == 0 then return 0 end
    local count = 0
    for i in ipairs(MataMata.Participantes) do
        if MataMata.Participantes[i].Active then
            if MataMata.Participantes[i].Info[1] == Name then
                return MataMata.Participantes[i].Intruder
            end
        end
    end

    return count
end

function MataMata.SetIntruderCount(Name, count)
    for i in ipairs(MataMata.Participantes) do
        if MataMata.Participantes[i].Active then
            if MataMata.Participantes[i].Info[1] == Name then
                MataMata.Participantes[i].Intruder = count
            end
        end
    end
end

function MataMata.CheckIfWasPlayer(Name)
    if #MataMata.Participantes == 0 then return false end

    for i in ipairs(MataMata.Participantes) do
        if not MataMata.Participantes[i].Active and not MataMata.Participantes[i].Removed then
            if MataMata.Participantes[i].Info[1] == Name then
                return true, MataMata.Participantes[i].Fase
            end
        end
    end

    return false, -1
end

function MataMata.CountPlayers(fase)
    if #MataMata.Participantes == 0 then return 0 end
    local count = 0
    for i in ipairs(MataMata.Participantes) do
        if MataMata.Participantes[i].Active and not MataMata.Participantes[i].Lutando then
            if MataMata.Participantes[i].Fase == fase then
                count = count + 1
            end
        end
    end

    return count
end

MataMata.Init()

return MataMata