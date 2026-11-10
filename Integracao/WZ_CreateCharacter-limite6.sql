

ALTER Procedure [dbo].[WZ_CreateCharacter] 

	@AccountID		varchar(10),		--// øŠµÏ µÏ§÷ 

	@Name			varchar(10),		--// ü÷îÖ 

	@Class			tinyint			--// Class Type

AS

Begin



	SET NOCOUNT ON

	SET	XACT_ABORT ON

	DECLARE		@Result		tinyint



	--//  ø ø£ø¦ ÇÒñƒÔğ 

	SET @Result = 0x00	



	--====================================================================================

	--	 ü÷îÖ µ÷·‡¨¸§× Ô©·× 

	--====================================================================================

	If EXISTS ( SELECT  Name  FROM  Character WHERE Name = @Name )

	begin

		SET @Result	= 0x01				--// æ¨·Ø ü÷îÖ÷¡ µ÷·‡ 						

		GOTO ProcEnd						

	end 



	-- LIMITE_6_CLASSES: no maximo 6 personagens por conta, classes livres
	IF (SELECT COUNT(*) FROM Character WHERE AccountID=@AccountID) >= 4
	begin
		SET @Result = 0x03
		GOTO ProcEnd
	end

	BEGIN TRAN

	--====================================================================================

	--	 øŠµÏ µ÷·‡ ¨¸§× Ô©·×  û §¢ ««úâ µÏ§÷ Ô©·×€Ø¨¸ ·£·† 		

	--====================================================================================

	If NOT EXISTS ( SELECT  Id  FROM  AccountCharacter WHERE Id = @AccountID )

		begin

			INSERT INTO dbo.AccountCharacter(Id, GameID1, GameID2, GameID3, GameID4, GameID5, GameID6, GameID7, GameID8, GameID9, GameID10, GameIDC) 

			VALUES(@AccountID, @Name, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)



			SET @Result  = @@Error

		end 

	else

		begin

			--// ü÷îÖ §¢ ««úâ ¬üµÏ 

			Declare @g1 varchar(10), @g2 varchar(10), @g3 varchar(10), @g4 varchar(10), @g5 varchar(10), @g6 varchar(10), @g7 varchar(10), @g8 varchar(10), @g9 varchar(10), @g10 varchar(10)

			SELECT @g1=GameID1, @g2=GameID2, @g3=GameID3, @g4=GameID4, @g5=GameID5, @g6=GameID6, @g7=GameID7, @g8=GameID8, @g9=GameID9, @g10=GameID10 FROM dbo.AccountCharacter Where Id = @AccountID 			



			if( ( @g1 Is NULL) OR (Len(@g1) = 0))

				begin

					UPDATE AccountCharacter SET  GameID1 = @Name

					WHERE Id = @AccountID

										

					SET @Result  = @@Error

				end 

			else if( @g2  Is NULL OR Len(@g2) = 0)

				begin

					UPDATE AccountCharacter SET  GameID2 = @Name

					WHERE Id = @AccountID



					SET @Result  = @@Error

				end 

			else if( @g3  Is NULL OR Len(@g3) = 0)

				begin			

					UPDATE AccountCharacter SET  GameID3 = @Name

					WHERE Id = @AccountID



					SET @Result  = @@Error

				end 

			else if( @g4 Is NULL OR Len(@g4) = 0)

				begin

					UPDATE AccountCharacter SET  GameID4 = @Name

					WHERE Id = @AccountID



					SET @Result  = @@Error

				end 

			else if( @g5 Is NULL OR Len(@g5) = 0)

				begin

					UPDATE AccountCharacter SET  GameID5 = @Name

					WHERE Id = @AccountID



					SET @Result  = @@Error

				end 		

			else if( @g6 Is NULL OR Len(@g6) = 0)

				begin

					UPDATE AccountCharacter SET  GameID6 = @Name

					WHERE Id = @AccountID



					SET @Result  = @@Error

				end 		

			else if( @g7 Is NULL OR Len(@g7) = 0)

				begin

					UPDATE AccountCharacter SET  GameID7 = @Name

					WHERE Id = @AccountID



					SET @Result  = @@Error

				end 		

			else if( @g8 Is NULL OR Len(@g8) = 0)

				begin

					UPDATE AccountCharacter SET  GameID8 = @Name

					WHERE Id = @AccountID



					SET @Result  = @@Error

				end 		

			else if( @g9 Is NULL OR Len(@g9) = 0)

				begin

					UPDATE AccountCharacter SET  GameID9 = @Name

					WHERE Id = @AccountID



					SET @Result  = @@Error

				end 		

			else if( @g10 Is NULL OR Len(@g10) = 0)

				begin

					UPDATE AccountCharacter SET  GameID10 = @Name

					WHERE Id = @AccountID



					SET @Result  = @@Error

				end 		

			else 

				--// €ï‡ §¢ ««úâ µÏ§÷ø­ µ÷·‡ €Øµ” óÒïë. 	

				begin					

					SET @Result	= 0x03							

					GOTO TranProcEnd								

				end 			 

		end 



	

	



	--====================================================================================

	--	 ü÷îÖ µÏ§÷ ·£·† 

	--====================================================================================

	if( @Result <> 0 )

		begin

			GOTO TranProcEnd		

		end 

	else

		begin

			INSERT INTO dbo.Character(AccountID, Name, cLevel, LevelUpPoint, Class, Strength, Dexterity, Vitality, Energy, Leadership, Inventory, MagicList, 

					Life, MaxLife, Mana, MaxMana, BP, MaxBP, Shield, MaxShield, MapNumber, MapPosX, MapPosY, MDate, LDate, Quest, DbVersion, EffectList )

			SELECT @AccountID As AccountID, @Name As Name, Level, LevelUpPoint, @Class As Class, 

				Strength, Dexterity, Vitality, Energy, Leadership, Inventory, MagicList, Life, MaxLife, Mana, MaxMana, 0, 0, 0, 0, MapNumber, MapPosX, MapPosY,

				getdate() As MDate, getdate() As LDate, Quest, DbVersion, EffectList

			FROM  DefaultClassType WHERE Class = @Class				



			SET @Result = @@Error

		end 



TranProcEnd:	-- GOTO

	IF ( @Result  <> 0 )

		ROLLBACK TRAN

	ELSE

		COMMIT	TRAN



ProcEnd:

	SET NOCOUNT OFF

	SET	XACT_ABORT OFF




	--====================================================================================


	--  ø ø£ø¦ ûíÔî Çü÷© 


	-- 0x00 : ü÷îÖ µ÷·‡, 0x01 : ¬§ø›¨Øú , 0x02 : ü÷îÖ ¯ì¬§ «€’Ñ , 0x03 : §¢««úâ µ÷·‡€Øµ” óÒï¶ïë   

	--====================================================================================

	SELECT

	   CASE @Result

	      WHEN 0x00 THEN 0x01		--// ¬§ø› ûíÔî 

	      WHEN 0x01 THEN 0x00		--// ü÷îÖ µ÷·‡ 

	      WHEN 0x03 THEN 0x03		--// §¢««úâ·Ş µ÷·‡€Øµ” óÒï¶ïë. 

	      ELSE 0x02				--// ñƒ÷ ¨­úîéæ†ï¶ ¯ì¬§ ¯›’Ñ ûíÔî  

	   END AS Result 

End




GO
UPDATE AccountCharacter SET MaxCharacter=4;
GO
