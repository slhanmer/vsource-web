import * as migration_20261104_080302_initial from './20261104_080302_initial';
import * as migration_20261104_223452_content_collections from './20261104_223452_content_collections';

export const migrations = [
  {
    up: migration_20261104_080302_initial.up,
    down: migration_20261104_080302_initial.down,
    name: '20261104_080302_initial',
  },
  {
    up: migration_20261104_223452_content_collections.up,
    down: migration_20261104_223452_content_collections.down,
    name: '20261104_223452_content_collections'
  },
];
