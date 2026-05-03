DO $$ BEGIN
	CREATE TYPE "floatingNoteKind" AS ENUM ('note', 'task');
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "floating_notes"
	ADD COLUMN IF NOT EXISTS "kind" "floatingNoteKind" NOT NULL DEFAULT 'note';

UPDATE "floating_notes"
	SET "kind" = 'task'
	WHERE "checklist" IS NOT NULL
		AND "checklist" <> ''
		AND "checklist" <> '[]';
