import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "streams" ALTER COLUMN "door_photo_id" DROP NOT NULL;
  ALTER TABLE "site" ADD COLUMN "hero_photo_id" integer;
  ALTER TABLE "site" ADD CONSTRAINT "site_hero_photo_id_media_id_fk" FOREIGN KEY ("hero_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_hero_photo_idx" ON "site" USING btree ("hero_photo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site" DROP CONSTRAINT "site_hero_photo_id_media_id_fk";
  
  DROP INDEX "site_hero_photo_idx";
  ALTER TABLE "streams" ALTER COLUMN "door_photo_id" SET NOT NULL;
  ALTER TABLE "site" DROP COLUMN "hero_photo_id";`)
}
