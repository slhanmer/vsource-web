import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "streams_sections" ADD COLUMN "media_upload_id" integer;
  ALTER TABLE "streams_sections" ADD COLUMN "media_poster_id" integer;
  ALTER TABLE "streams_sections" ADD COLUMN "media_alt" varchar;
  ALTER TABLE "streams" ADD COLUMN "page_photo_id" integer;
  ALTER TABLE "streams_sections" ADD CONSTRAINT "streams_sections_media_upload_id_media_id_fk" FOREIGN KEY ("media_upload_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "streams_sections" ADD CONSTRAINT "streams_sections_media_poster_id_media_id_fk" FOREIGN KEY ("media_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "streams" ADD CONSTRAINT "streams_page_photo_id_media_id_fk" FOREIGN KEY ("page_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "streams_sections_media_media_upload_idx" ON "streams_sections" USING btree ("media_upload_id");
  CREATE INDEX "streams_sections_media_media_poster_idx" ON "streams_sections" USING btree ("media_poster_id");
  CREATE INDEX "streams_page_photo_idx" ON "streams" USING btree ("page_photo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "streams_sections" DROP CONSTRAINT "streams_sections_media_upload_id_media_id_fk";
  
  ALTER TABLE "streams_sections" DROP CONSTRAINT "streams_sections_media_poster_id_media_id_fk";
  
  ALTER TABLE "streams" DROP CONSTRAINT "streams_page_photo_id_media_id_fk";
  
  DROP INDEX "streams_sections_media_media_upload_idx";
  DROP INDEX "streams_sections_media_media_poster_idx";
  DROP INDEX "streams_page_photo_idx";
  ALTER TABLE "streams_sections" DROP COLUMN "media_upload_id";
  ALTER TABLE "streams_sections" DROP COLUMN "media_poster_id";
  ALTER TABLE "streams_sections" DROP COLUMN "media_alt";
  ALTER TABLE "streams" DROP COLUMN "page_photo_id";`)
}
