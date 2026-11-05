import * as migration_20261104_080302_initial from './20261104_080302_initial';
import * as migration_20261104_223452_content_collections from './20261104_223452_content_collections';
import * as migration_20261104_230733_built_trim from './20261104_230733_built_trim';
import * as migration_20261105_003136_hero_rebuild from './20261105_003136_hero_rebuild';
import * as migration_20261105_011354_hero_photos from './20261105_011354_hero_photos';

export const migrations = [
  {
    up: migration_20261104_080302_initial.up,
    down: migration_20261104_080302_initial.down,
    name: '20261104_080302_initial',
  },
  {
    up: migration_20261104_223452_content_collections.up,
    down: migration_20261104_223452_content_collections.down,
    name: '20261104_223452_content_collections',
  },
  {
    up: migration_20261104_230733_built_trim.up,
    down: migration_20261104_230733_built_trim.down,
    name: '20261104_230733_built_trim',
  },
  {
    up: migration_20261105_003136_hero_rebuild.up,
    down: migration_20261105_003136_hero_rebuild.down,
    name: '20261105_003136_hero_rebuild',
  },
  {
    up: migration_20261105_011354_hero_photos.up,
    down: migration_20261105_011354_hero_photos.down,
    name: '20261105_011354_hero_photos'
  },
];
