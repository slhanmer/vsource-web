import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site" DROP CONSTRAINT "site_hero_photos_software_band_id_media_id_fk";
  
  ALTER TABLE "site" DROP CONSTRAINT "site_hero_photos_robotics_band_id_media_id_fk";
  
  ALTER TABLE "site" DROP CONSTRAINT "site_hero_photos_websites_band_id_media_id_fk";
  
  DROP INDEX "site_hero_photos_software_hero_photos_software_band_idx";
  DROP INDEX "site_hero_photos_robotics_hero_photos_robotics_band_idx";
  DROP INDEX "site_hero_photos_websites_hero_photos_websites_band_idx";
  ALTER TABLE "site" DROP COLUMN "hero_photos_software_band_id";
  ALTER TABLE "site" DROP COLUMN "hero_photos_robotics_band_id";
  ALTER TABLE "site" DROP COLUMN "hero_photos_websites_band_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site" ADD COLUMN "hero_photos_software_band_id" integer;
  ALTER TABLE "site" ADD COLUMN "hero_photos_robotics_band_id" integer;
  ALTER TABLE "site" ADD COLUMN "hero_photos_websites_band_id" integer;
  ALTER TABLE "site" ADD CONSTRAINT "site_hero_photos_software_band_id_media_id_fk" FOREIGN KEY ("hero_photos_software_band_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site" ADD CONSTRAINT "site_hero_photos_robotics_band_id_media_id_fk" FOREIGN KEY ("hero_photos_robotics_band_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site" ADD CONSTRAINT "site_hero_photos_websites_band_id_media_id_fk" FOREIGN KEY ("hero_photos_websites_band_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_hero_photos_software_hero_photos_software_band_idx" ON "site" USING btree ("hero_photos_software_band_id");
  CREATE INDEX "site_hero_photos_robotics_hero_photos_robotics_band_idx" ON "site" USING btree ("hero_photos_robotics_band_id");
  CREATE INDEX "site_hero_photos_websites_hero_photos_websites_band_idx" ON "site" USING btree ("hero_photos_websites_band_id");`)
}
