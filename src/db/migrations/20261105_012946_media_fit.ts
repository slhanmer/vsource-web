import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_media_fit" AS ENUM('cover', 'contain');
  ALTER TABLE "projects" ADD COLUMN "media_fit" "enum_projects_media_fit" DEFAULT 'cover';
  ALTER TABLE "_projects_v" ADD COLUMN "version_media_fit" "enum_projects_media_fit" DEFAULT 'cover';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" DROP COLUMN "media_fit";
  ALTER TABLE "_projects_v" DROP COLUMN "version_media_fit";
  DROP TYPE "public"."enum_projects_media_fit";`)
}
