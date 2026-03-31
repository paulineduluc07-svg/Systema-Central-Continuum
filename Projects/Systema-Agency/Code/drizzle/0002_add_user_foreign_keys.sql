DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'tasks_userId_users_id_fk'
	) THEN
		ALTER TABLE "tasks"
		ADD CONSTRAINT "tasks_userId_users_id_fk"
		FOREIGN KEY ("userId")
		REFERENCES "public"."users"("id")
		ON DELETE CASCADE
		ON UPDATE NO ACTION;
	END IF;
END $$;

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'notes_userId_users_id_fk'
	) THEN
		ALTER TABLE "notes"
		ADD CONSTRAINT "notes_userId_users_id_fk"
		FOREIGN KEY ("userId")
		REFERENCES "public"."users"("id")
		ON DELETE CASCADE
		ON UPDATE NO ACTION;
	END IF;
END $$;

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'user_preferences_userId_users_id_fk'
	) THEN
		ALTER TABLE "user_preferences"
		ADD CONSTRAINT "user_preferences_userId_users_id_fk"
		FOREIGN KEY ("userId")
		REFERENCES "public"."users"("id")
		ON DELETE CASCADE
		ON UPDATE NO ACTION;
	END IF;
END $$;

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'custom_tabs_userId_users_id_fk'
	) THEN
		ALTER TABLE "custom_tabs"
		ADD CONSTRAINT "custom_tabs_userId_users_id_fk"
		FOREIGN KEY ("userId")
		REFERENCES "public"."users"("id")
		ON DELETE CASCADE
		ON UPDATE NO ACTION;
	END IF;
END $$;

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'canvas_data_userId_users_id_fk'
	) THEN
		ALTER TABLE "canvas_data"
		ADD CONSTRAINT "canvas_data_userId_users_id_fk"
		FOREIGN KEY ("userId")
		REFERENCES "public"."users"("id")
		ON DELETE CASCADE
		ON UPDATE NO ACTION;
	END IF;
END $$;

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'suivi_entries_userId_users_id_fk'
	) THEN
		ALTER TABLE "suivi_entries"
		ADD CONSTRAINT "suivi_entries_userId_users_id_fk"
		FOREIGN KEY ("userId")
		REFERENCES "public"."users"("id")
		ON DELETE CASCADE
		ON UPDATE NO ACTION;
	END IF;
END $$;
