CREATE TABLE IF NOT EXISTS "suivi_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"timestamp" timestamp NOT NULL,
	"date" varchar(10) NOT NULL,
	"prise" varchar(5) NOT NULL,
	"dose" integer NOT NULL,
	"reasons" text DEFAULT '[]' NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
