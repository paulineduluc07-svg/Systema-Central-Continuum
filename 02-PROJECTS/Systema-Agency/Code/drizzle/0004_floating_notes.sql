DO $$ BEGIN
	CREATE TYPE "floatingNoteAccent" AS ENUM ('pink', 'violet', 'lavender', 'cyan', 'mint');
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
	CREATE TYPE "floatingNoteStyle" AS ENUM ('neon', 'frost', 'holo');
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "floating_notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"checklist" text DEFAULT '[]' NOT NULL,
	"x" integer DEFAULT 120 NOT NULL,
	"y" integer DEFAULT 120 NOT NULL,
	"w" integer DEFAULT 240 NOT NULL,
	"h" integer DEFAULT 220 NOT NULL,
	"accent" "floatingNoteAccent" DEFAULT 'pink' NOT NULL,
	"style" "floatingNoteStyle",
	"archived" boolean DEFAULT false NOT NULL,
	"archivedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'floating_notes_userId_users_id_fk'
	) THEN
		ALTER TABLE "floating_notes"
		ADD CONSTRAINT "floating_notes_userId_users_id_fk"
		FOREIGN KEY ("userId")
		REFERENCES "public"."users"("id")
		ON DELETE CASCADE
		ON UPDATE NO ACTION;
	END IF;
END $$;

CREATE INDEX IF NOT EXISTS "floating_notes_userId_archived_idx"
	ON "floating_notes" ("userId", "archived");
