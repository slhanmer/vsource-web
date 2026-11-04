import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_project_status" AS ENUM('live', 'building', 'starting');
  CREATE TYPE "public"."enum_projects_media_kind" AS ENUM('image', 'video', 'mark');
  CREATE TYPE "public"."enum_projects_media_mark_id" AS ENUM('software', 'robotics', 'websites');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_version_media_kind" AS ENUM('image', 'video', 'mark');
  CREATE TYPE "public"."enum__projects_v_version_media_mark_id" AS ENUM('software', 'robotics', 'websites');
  CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "streams_sections_body" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "streams_sections_includes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "streams_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"link_href" varchar,
  	"link_label" varchar,
  	"pending" boolean DEFAULT false
  );
  
  CREATE TABLE "streams_caps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "streams" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"door" varchar NOT NULL,
  	"door_photo_id" integer NOT NULL,
  	"problem" varchar NOT NULL,
  	"instead" varchar NOT NULL,
  	"solution" varchar NOT NULL,
  	"step_photo_id" integer NOT NULL,
  	"promise" varchar NOT NULL,
  	"page_lede" varchar NOT NULL,
  	"lede" varchar NOT NULL,
  	"who" varchar NOT NULL,
  	"proof_label" varchar NOT NULL,
  	"proof_body" varchar NOT NULL,
  	"proof_pending" boolean DEFAULT false,
  	"pricing_value" varchar NOT NULL,
  	"pricing_note" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "projects_body" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "projects_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"order" numeric DEFAULT 0,
  	"featured" boolean DEFAULT false,
  	"placeholder" boolean DEFAULT false,
  	"client" varchar,
  	"stream_id" integer,
  	"year" varchar,
  	"status" "enum_projects_project_status" DEFAULT 'live',
  	"line" varchar,
  	"lede" varchar,
  	"url" varchar,
  	"media_kind" "enum_projects_media_kind" DEFAULT 'image',
  	"media_upload_id" integer,
  	"media_poster_id" integer,
  	"media_mark_id" "enum_projects_media_mark_id",
  	"media_alt" varchar,
  	"media_long_href" varchar,
  	"media_long_label" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_projects_v_version_body" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_featured" boolean DEFAULT false,
  	"version_placeholder" boolean DEFAULT false,
  	"version_client" varchar,
  	"version_stream_id" integer,
  	"version_year" varchar,
  	"version_status" "enum_projects_project_status" DEFAULT 'live',
  	"version_line" varchar,
  	"version_lede" varchar,
  	"version_url" varchar,
  	"version_media_kind" "enum__projects_v_version_media_kind" DEFAULT 'image',
  	"version_media_upload_id" integer,
  	"version_media_poster_id" integer,
  	"version_media_mark_id" "enum__projects_v_version_media_mark_id",
  	"version_media_alt" varchar,
  	"version_media_long_href" varchar,
  	"version_media_long_label" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "crew_bio" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "crew" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"pending" boolean DEFAULT false,
  	"role" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"portrait_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "partners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"pending" boolean DEFAULT false,
  	"kind" varchar NOT NULL,
  	"logo_id" integer NOT NULL,
  	"body" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_coming_soon" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"stream_id" integer NOT NULL
  );
  
  CREATE TABLE "site" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"working_photo_id" integer NOT NULL,
  	"group_photo_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "streams_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "projects_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "crew_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "partners_id" integer;
  ALTER TABLE "streams_sections_body" ADD CONSTRAINT "streams_sections_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."streams_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "streams_sections_includes" ADD CONSTRAINT "streams_sections_includes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."streams_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "streams_sections" ADD CONSTRAINT "streams_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."streams"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "streams_caps" ADD CONSTRAINT "streams_caps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."streams"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "streams" ADD CONSTRAINT "streams_door_photo_id_media_id_fk" FOREIGN KEY ("door_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "streams" ADD CONSTRAINT "streams_step_photo_id_media_id_fk" FOREIGN KEY ("step_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_body" ADD CONSTRAINT "projects_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_facts" ADD CONSTRAINT "projects_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_stream_id_streams_id_fk" FOREIGN KEY ("stream_id") REFERENCES "public"."streams"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_media_upload_id_media_id_fk" FOREIGN KEY ("media_upload_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_media_poster_id_media_id_fk" FOREIGN KEY ("media_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_version_body" ADD CONSTRAINT "_projects_v_version_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_facts" ADD CONSTRAINT "_projects_v_version_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_stream_id_streams_id_fk" FOREIGN KEY ("version_stream_id") REFERENCES "public"."streams"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_media_upload_id_media_id_fk" FOREIGN KEY ("version_media_upload_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_media_poster_id_media_id_fk" FOREIGN KEY ("version_media_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "crew_bio" ADD CONSTRAINT "crew_bio_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."crew"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "crew" ADD CONSTRAINT "crew_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners" ADD CONSTRAINT "partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_coming_soon" ADD CONSTRAINT "site_coming_soon_stream_id_streams_id_fk" FOREIGN KEY ("stream_id") REFERENCES "public"."streams"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_coming_soon" ADD CONSTRAINT "site_coming_soon_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site" ADD CONSTRAINT "site_working_photo_id_media_id_fk" FOREIGN KEY ("working_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site" ADD CONSTRAINT "site_group_photo_id_media_id_fk" FOREIGN KEY ("group_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "streams_sections_body_order_idx" ON "streams_sections_body" USING btree ("_order");
  CREATE INDEX "streams_sections_body_parent_id_idx" ON "streams_sections_body" USING btree ("_parent_id");
  CREATE INDEX "streams_sections_includes_order_idx" ON "streams_sections_includes" USING btree ("_order");
  CREATE INDEX "streams_sections_includes_parent_id_idx" ON "streams_sections_includes" USING btree ("_parent_id");
  CREATE INDEX "streams_sections_order_idx" ON "streams_sections" USING btree ("_order");
  CREATE INDEX "streams_sections_parent_id_idx" ON "streams_sections" USING btree ("_parent_id");
  CREATE INDEX "streams_caps_order_idx" ON "streams_caps" USING btree ("_order");
  CREATE INDEX "streams_caps_parent_id_idx" ON "streams_caps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "streams_slug_idx" ON "streams" USING btree ("slug");
  CREATE INDEX "streams_order_idx" ON "streams" USING btree ("order");
  CREATE INDEX "streams_door_photo_idx" ON "streams" USING btree ("door_photo_id");
  CREATE INDEX "streams_step_photo_idx" ON "streams" USING btree ("step_photo_id");
  CREATE INDEX "streams_updated_at_idx" ON "streams" USING btree ("updated_at");
  CREATE INDEX "streams_created_at_idx" ON "streams" USING btree ("created_at");
  CREATE INDEX "projects_body_order_idx" ON "projects_body" USING btree ("_order");
  CREATE INDEX "projects_body_parent_id_idx" ON "projects_body" USING btree ("_parent_id");
  CREATE INDEX "projects_facts_order_idx" ON "projects_facts" USING btree ("_order");
  CREATE INDEX "projects_facts_parent_id_idx" ON "projects_facts" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_order_idx" ON "projects" USING btree ("order");
  CREATE INDEX "projects_stream_idx" ON "projects" USING btree ("stream_id");
  CREATE INDEX "projects_media_media_upload_idx" ON "projects" USING btree ("media_upload_id");
  CREATE INDEX "projects_media_media_poster_idx" ON "projects" USING btree ("media_poster_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "projects__status_idx" ON "projects" USING btree ("_status");
  CREATE INDEX "_projects_v_version_body_order_idx" ON "_projects_v_version_body" USING btree ("_order");
  CREATE INDEX "_projects_v_version_body_parent_id_idx" ON "_projects_v_version_body" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_facts_order_idx" ON "_projects_v_version_facts" USING btree ("_order");
  CREATE INDEX "_projects_v_version_facts_parent_id_idx" ON "_projects_v_version_facts" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "_projects_v" USING btree ("version_slug");
  CREATE INDEX "_projects_v_version_version_order_idx" ON "_projects_v" USING btree ("version_order");
  CREATE INDEX "_projects_v_version_version_stream_idx" ON "_projects_v" USING btree ("version_stream_id");
  CREATE INDEX "_projects_v_version_media_version_media_upload_idx" ON "_projects_v" USING btree ("version_media_upload_id");
  CREATE INDEX "_projects_v_version_media_version_media_poster_idx" ON "_projects_v" USING btree ("version_media_poster_id");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_latest_idx" ON "_projects_v" USING btree ("latest");
  CREATE INDEX "crew_bio_order_idx" ON "crew_bio" USING btree ("_order");
  CREATE INDEX "crew_bio_parent_id_idx" ON "crew_bio" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "crew_slug_idx" ON "crew" USING btree ("slug");
  CREATE INDEX "crew_order_idx" ON "crew" USING btree ("order");
  CREATE INDEX "crew_portrait_idx" ON "crew" USING btree ("portrait_id");
  CREATE INDEX "crew_updated_at_idx" ON "crew" USING btree ("updated_at");
  CREATE INDEX "crew_created_at_idx" ON "crew" USING btree ("created_at");
  CREATE UNIQUE INDEX "partners_slug_idx" ON "partners" USING btree ("slug");
  CREATE INDEX "partners_order_idx" ON "partners" USING btree ("order");
  CREATE INDEX "partners_logo_idx" ON "partners" USING btree ("logo_id");
  CREATE INDEX "partners_updated_at_idx" ON "partners" USING btree ("updated_at");
  CREATE INDEX "partners_created_at_idx" ON "partners" USING btree ("created_at");
  CREATE INDEX "site_coming_soon_order_idx" ON "site_coming_soon" USING btree ("_order");
  CREATE INDEX "site_coming_soon_parent_id_idx" ON "site_coming_soon" USING btree ("_parent_id");
  CREATE INDEX "site_coming_soon_stream_idx" ON "site_coming_soon" USING btree ("stream_id");
  CREATE INDEX "site_working_photo_idx" ON "site" USING btree ("working_photo_id");
  CREATE INDEX "site_group_photo_idx" ON "site" USING btree ("group_photo_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_streams_fk" FOREIGN KEY ("streams_id") REFERENCES "public"."streams"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_crew_fk" FOREIGN KEY ("crew_id") REFERENCES "public"."crew"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_streams_id_idx" ON "payload_locked_documents_rels" USING btree ("streams_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_crew_id_idx" ON "payload_locked_documents_rels" USING btree ("crew_id");
  CREATE INDEX "payload_locked_documents_rels_partners_id_idx" ON "payload_locked_documents_rels" USING btree ("partners_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "streams_sections_body" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "streams_sections_includes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "streams_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "streams_caps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "streams" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_body" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_facts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_body" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_facts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "crew_bio" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "crew" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "partners" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_coming_soon" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "streams_sections_body" CASCADE;
  DROP TABLE "streams_sections_includes" CASCADE;
  DROP TABLE "streams_sections" CASCADE;
  DROP TABLE "streams_caps" CASCADE;
  DROP TABLE "streams" CASCADE;
  DROP TABLE "projects_body" CASCADE;
  DROP TABLE "projects_facts" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "_projects_v_version_body" CASCADE;
  DROP TABLE "_projects_v_version_facts" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "crew_bio" CASCADE;
  DROP TABLE "crew" CASCADE;
  DROP TABLE "partners" CASCADE;
  DROP TABLE "site_coming_soon" CASCADE;
  DROP TABLE "site" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_streams_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_projects_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_crew_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_partners_fk";
  
  DROP INDEX "payload_locked_documents_rels_streams_id_idx";
  DROP INDEX "payload_locked_documents_rels_projects_id_idx";
  DROP INDEX "payload_locked_documents_rels_crew_id_idx";
  DROP INDEX "payload_locked_documents_rels_partners_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "streams_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "projects_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "crew_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "partners_id";
  DROP TYPE "public"."enum_projects_project_status";
  DROP TYPE "public"."enum_projects_media_kind";
  DROP TYPE "public"."enum_projects_media_mark_id";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_version_media_kind";
  DROP TYPE "public"."enum__projects_v_version_media_mark_id";
  DROP TYPE "public"."enum__projects_v_version_status";`)
}
