CREATE TYPE "public"."resource_category" AS ENUM('conflict-resolution', 'leadership', 'communication');--> statement-breakpoint
CREATE TYPE "public"."resource_language" AS ENUM('en', 'es', 'fr');--> statement-breakpoint
CREATE TYPE "public"."resource_provider" AS ENUM('pack', 'partner');--> statement-breakpoint
CREATE TABLE "catalog_entries" (
	"kind" text NOT NULL,
	"slug" text NOT NULL,
	"label" text NOT NULL,
	CONSTRAINT "catalog_entries_kind_slug_pk" PRIMARY KEY("kind","slug")
);
--> statement-breakpoint
CREATE TABLE "resources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" varchar(1000) NOT NULL,
	"category" "resource_category" NOT NULL,
	"language" "resource_language" NOT NULL,
	"provider" "resource_provider" NOT NULL,
	"roles" text[] NOT NULL,
	"file_original_name" varchar(255) NOT NULL,
	"file_mime_type" text NOT NULL,
	"file_size" bigint NOT NULL,
	"storage_path" text NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"uploaded_by" varchar(200),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "resources_storage_path_unique" UNIQUE("storage_path"),
	CONSTRAINT "resources_roles_nonempty" CHECK (cardinality("resources"."roles") >= 1),
	CONSTRAINT "resources_file_size_range" CHECK ("resources"."file_size" > 0 AND "resources"."file_size" <= 52428800)
);
