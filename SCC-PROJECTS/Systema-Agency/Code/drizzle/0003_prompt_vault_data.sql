CREATE TABLE IF NOT EXISTS "prompt_vault_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"data" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'prompt_vault_data_userId_unique'
	) THEN
		ALTER TABLE "prompt_vault_data"
		ADD CONSTRAINT "prompt_vault_data_userId_unique"
		UNIQUE ("userId");
	END IF;
END $$;

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'prompt_vault_data_userId_users_id_fk'
	) THEN
		ALTER TABLE "prompt_vault_data"
		ADD CONSTRAINT "prompt_vault_data_userId_users_id_fk"
		FOREIGN KEY ("userId")
		REFERENCES "public"."users"("id")
		ON DELETE CASCADE
		ON UPDATE NO ACTION;
	END IF;
END $$;