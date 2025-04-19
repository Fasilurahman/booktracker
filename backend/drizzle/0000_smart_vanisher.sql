CREATE TABLE "books" (
	"id" varchar(10) PRIMARY KEY NOT NULL,
	"title" varchar(300) NOT NULL,
	"author" varchar(30) NOT NULL,
	"status" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notes" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"book_id" varchar(36) NOT NULL,
	"content" varchar(500) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;