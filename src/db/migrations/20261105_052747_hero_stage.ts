import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site" DROP CONSTRAINT "site_hero_photos_software_id_media_id_fk";
  
  ALTER TABLE "site" DROP CONSTRAINT "site_hero_photos_robotics_id_media_id_fk";
  
  ALTER TABLE "site" DROP CONSTRAINT "site_hero_photos_websites_id_media_id_fk";
  
  ALTER TABLE "site" DROP CONSTRAINT "site_hero_photos_team_id_media_id_fk";
  
  DROP INDEX "site_hero_photos_hero_photos_software_idx";
  DROP INDEX "site_hero_photos_hero_photos_robotics_idx";
  DROP INDEX "site_hero_photos_hero_photos_websites_idx";
  DROP INDEX "site_hero_photos_hero_photos_team_idx";
  ALTER TABLE "site" ADD COLUMN "hero_photos_software_photo_id" integer;
  ALTER TABLE "site" ADD COLUMN "hero_photos_software_focus" varchar DEFAULT '50% 50%';
  ALTER TABLE "site" ADD COLUMN "hero_photos_robotics_photo_id" integer;
  ALTER TABLE "site" ADD COLUMN "hero_photos_robotics_focus" varchar DEFAULT '50% 50%';
  ALTER TABLE "site" ADD COLUMN "hero_photos_websites_photo_id" integer;
  ALTER TABLE "site" ADD COLUMN "hero_photos_websites_focus" varchar DEFAULT '50% 50%';
  ALTER TABLE "site" ADD CONSTRAINT "site_hero_photos_software_photo_id_media_id_fk" FOREIGN KEY ("hero_photos_software_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site" ADD CONSTRAINT "site_hero_photos_robotics_photo_id_media_id_fk" FOREIGN KEY ("hero_photos_robotics_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site" ADD CONSTRAINT "site_hero_photos_websites_photo_id_media_id_fk" FOREIGN KEY ("hero_photos_websites_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_hero_photos_software_hero_photos_software_photo_idx" ON "site" USING btree ("hero_photos_software_photo_id");
  CREATE INDEX "site_hero_photos_robotics_hero_photos_robotics_photo_idx" ON "site" USING btree ("hero_photos_robotics_photo_id");
  CREATE INDEX "site_hero_photos_websites_hero_photos_websites_photo_idx" ON "site" USING btree ("hero_photos_websites_photo_id");
  -- hand-added: carry the three stream photos into their new columns before
  -- the old ones go. The team photo leaves the fold (hero-stage); its media
  -- document stays, used by /team and "Why we work this way".
  UPDATE "site" SET
    "hero_photos_software_photo_id" = "hero_photos_software_id",
    "hero_photos_robotics_photo_id" = "hero_photos_robotics_id",
    "hero_photos_websites_photo_id" = "hero_photos_websites_id";
  ALTER TABLE "site" DROP COLUMN "hero_photos_software_id";
  ALTER TABLE "site" DROP COLUMN "hero_photos_robotics_id";
  ALTER TABLE "site" DROP COLUMN "hero_photos_websites_id";
  ALTER TABLE "site" DROP COLUMN "hero_photos_team_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site" DROP CONSTRAINT "site_hero_photos_software_photo_id_media_id_fk";
  
  ALTER TABLE "site" DROP CONSTRAINT "site_hero_photos_robotics_photo_id_media_id_fk";
  
  ALTER TABLE "site" DROP CONSTRAINT "site_hero_photos_websites_photo_id_media_id_fk";
  
  DROP INDEX "site_hero_photos_software_hero_photos_software_photo_idx";
  DROP INDEX "site_hero_photos_robotics_hero_photos_robotics_photo_idx";
  DROP INDEX "site_hero_photos_websites_hero_photos_websites_photo_idx";
  ALTER TABLE "site" ADD COLUMN "hero_photos_software_id" integer;
  ALTER TABLE "site" ADD COLUMN "hero_photos_robotics_id" integer;
  ALTER TABLE "site" ADD COLUMN "hero_photos_websites_id" integer;
  ALTER TABLE "site" ADD COLUMN "hero_photos_team_id" integer;
  ALTER TABLE "site" ADD CONSTRAINT "site_hero_photos_software_id_media_id_fk" FOREIGN KEY ("hero_photos_software_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site" ADD CONSTRAINT "site_hero_photos_robotics_id_media_id_fk" FOREIGN KEY ("hero_photos_robotics_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site" ADD CONSTRAINT "site_hero_photos_websites_id_media_id_fk" FOREIGN KEY ("hero_photos_websites_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site" ADD CONSTRAINT "site_hero_photos_team_id_media_id_fk" FOREIGN KEY ("hero_photos_team_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_hero_photos_hero_photos_software_idx" ON "site" USING btree ("hero_photos_software_id");
  CREATE INDEX "site_hero_photos_hero_photos_robotics_idx" ON "site" USING btree ("hero_photos_robotics_id");
  CREATE INDEX "site_hero_photos_hero_photos_websites_idx" ON "site" USING btree ("hero_photos_websites_id");
  CREATE INDEX "site_hero_photos_hero_photos_team_idx" ON "site" USING btree ("hero_photos_team_id");
  -- hand-added: carry the three photos back. The team photo is not restored;
  -- the seed (or /admin) has to set it again.
  UPDATE "site" SET
    "hero_photos_software_id" = "hero_photos_software_photo_id",
    "hero_photos_robotics_id" = "hero_photos_robotics_photo_id",
    "hero_photos_websites_id" = "hero_photos_websites_photo_id";
  ALTER TABLE "site" DROP COLUMN "hero_photos_software_photo_id";
  ALTER TABLE "site" DROP COLUMN "hero_photos_software_focus";
  ALTER TABLE "site" DROP COLUMN "hero_photos_robotics_photo_id";
  ALTER TABLE "site" DROP COLUMN "hero_photos_robotics_focus";
  ALTER TABLE "site" DROP COLUMN "hero_photos_websites_photo_id";
  ALTER TABLE "site" DROP COLUMN "hero_photos_websites_focus";`)
}
