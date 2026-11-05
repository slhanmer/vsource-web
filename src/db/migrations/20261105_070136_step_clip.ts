import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "streams" ADD COLUMN "step_clip_id" integer;
  ALTER TABLE "streams" ADD CONSTRAINT "streams_step_clip_id_media_id_fk" FOREIGN KEY ("step_clip_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "streams_step_clip_idx" ON "streams" USING btree ("step_clip_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "streams" DROP CONSTRAINT "streams_step_clip_id_media_id_fk";
  
  DROP INDEX "streams_step_clip_idx";
  ALTER TABLE "streams" DROP COLUMN "step_clip_id";`)
}
