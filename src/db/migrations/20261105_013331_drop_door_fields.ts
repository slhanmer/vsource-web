import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "streams" DROP CONSTRAINT "streams_door_photo_id_media_id_fk";
  
  DROP INDEX "streams_door_photo_idx";
  ALTER TABLE "streams" DROP COLUMN "door";
  ALTER TABLE "streams" DROP COLUMN "door_photo_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "streams" ADD COLUMN "door" varchar NOT NULL;
  ALTER TABLE "streams" ADD COLUMN "door_photo_id" integer;
  ALTER TABLE "streams" ADD CONSTRAINT "streams_door_photo_id_media_id_fk" FOREIGN KEY ("door_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "streams_door_photo_idx" ON "streams" USING btree ("door_photo_id");`)
}
