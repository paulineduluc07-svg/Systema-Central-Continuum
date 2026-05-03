CREATE TABLE IF NOT EXISTS "agenda_week_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"weekStart" varchar(10) NOT NULL,
	"data" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'agenda_week_data_user_week_unique'
	) THEN
		ALTER TABLE "agenda_week_data"
		ADD CONSTRAINT "agenda_week_data_user_week_unique"
		UNIQUE ("userId", "weekStart");
	END IF;
END $$;

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'agenda_week_data_userId_users_id_fk'
	) THEN
		ALTER TABLE "agenda_week_data"
		ADD CONSTRAINT "agenda_week_data_userId_users_id_fk"
		FOREIGN KEY ("userId")
		REFERENCES "public"."users"("id")
		ON DELETE CASCADE
		ON UPDATE NO ACTION;
	END IF;
END $$;
