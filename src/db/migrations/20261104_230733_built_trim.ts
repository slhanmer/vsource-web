import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_projects_media_kind" ADD VALUE 'logo' BEFORE 'mark';
  ALTER TYPE "public"."enum__projects_v_version_media_kind" ADD VALUE 'logo' BEFORE 'mark';
  CREATE TABLE "projects_sites" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"url" varchar,
  	"where" varchar,
  	"screenshot_id" integer
  );
  
  CREATE TABLE "_projects_v_version_sites" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"url" varchar,
  	"where" varchar,
  	"screenshot_id" integer,
  	"_uuid" varchar
  );
  
  ALTER TABLE "projects_sites" ADD CONSTRAINT "projects_sites_screenshot_id_media_id_fk" FOREIGN KEY ("screenshot_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_sites" ADD CONSTRAINT "projects_sites_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_sites" ADD CONSTRAINT "_projects_v_version_sites_screenshot_id_media_id_fk" FOREIGN KEY ("screenshot_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_version_sites" ADD CONSTRAINT "_projects_v_version_sites_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_sites_order_idx" ON "projects_sites" USING btree ("_order");
  CREATE INDEX "projects_sites_parent_id_idx" ON "projects_sites" USING btree ("_parent_id");
  CREATE INDEX "projects_sites_screenshot_idx" ON "projects_sites" USING btree ("screenshot_id");
  CREATE INDEX "_projects_v_version_sites_order_idx" ON "_projects_v_version_sites" USING btree ("_order");
  CREATE INDEX "_projects_v_version_sites_parent_id_idx" ON "_projects_v_version_sites" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_sites_screenshot_idx" ON "_projects_v_version_sites" USING btree ("screenshot_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "projects_sites" CASCADE;
  DROP TABLE "_projects_v_version_sites" CASCADE;
  ALTER TABLE "projects" ALTER COLUMN "media_kind" SET DATA TYPE text;
  ALTER TABLE "projects" ALTER COLUMN "media_kind" SET DEFAULT 'image'::text;
  DROP TYPE "public"."enum_projects_media_kind";
  CREATE TYPE "public"."enum_projects_media_kind" AS ENUM('image', 'video', 'mark');
  ALTER TABLE "projects" ALTER COLUMN "media_kind" SET DEFAULT 'image'::"public"."enum_projects_media_kind";
  ALTER TABLE "projects" ALTER COLUMN "media_kind" SET DATA TYPE "public"."enum_projects_media_kind" USING "media_kind"::"public"."enum_projects_media_kind";
  ALTER TABLE "_projects_v" ALTER COLUMN "version_media_kind" SET DATA TYPE text;
  ALTER TABLE "_projects_v" ALTER COLUMN "version_media_kind" SET DEFAULT 'image'::text;
  DROP TYPE "public"."enum__projects_v_version_media_kind";
  CREATE TYPE "public"."enum__projects_v_version_media_kind" AS ENUM('image', 'video', 'mark');
  ALTER TABLE "_projects_v" ALTER COLUMN "version_media_kind" SET DEFAULT 'image'::"public"."enum__projects_v_version_media_kind";
  ALTER TABLE "_projects_v" ALTER COLUMN "version_media_kind" SET DATA TYPE "public"."enum__projects_v_version_media_kind" USING "version_media_kind"::"public"."enum__projects_v_version_media_kind";`)
}
