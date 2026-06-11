CREATE TABLE IF NOT EXISTS "cosmos_readings" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"date" varchar(10) NOT NULL,
	"data" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'cosmos_readings_user_date_unique'
	) THEN
		ALTER TABLE "cosmos_readings"
		ADD CONSTRAINT "cosmos_readings_user_date_unique"
		UNIQUE ("userId", "date");
	END IF;
END $$;

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'cosmos_readings_userId_users_id_fk'
	) THEN
		ALTER TABLE "cosmos_readings"
		ADD CONSTRAINT "cosmos_readings_userId_users_id_fk"
		FOREIGN KEY ("userId")
		REFERENCES "public"."users"("id")
		ON DELETE CASCADE
		ON UPDATE NO ACTION;
	END IF;
END $$;
