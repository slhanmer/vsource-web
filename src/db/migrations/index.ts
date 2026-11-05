import * as migration_20261104_080302_initial from './20261104_080302_initial';
import * as migration_20261104_223452_content_collections from './20261104_223452_content_collections';
import * as migration_20261104_230733_built_trim from './20261104_230733_built_trim';
import * as migration_20261105_003136_hero_rebuild from './20261105_003136_hero_rebuild';
import * as migration_20261105_011354_hero_photos from './20261105_011354_hero_photos';
import * as migration_20261105_012459_stream_media from './20261105_012459_stream_media';
import * as migration_20261105_012946_media_fit from './20261105_012946_media_fit';
import * as migration_20261105_013331_drop_door_fields from './20261105_013331_drop_door_fields';
import * as migration_20261105_052747_hero_stage from './20261105_052747_hero_stage';
import * as migration_20261105_065118_hero_bands from './20261105_065118_hero_bands';
import * as migration_20261105_070136_step_clip from './20261105_070136_step_clip';
import * as migration_20261105_081531_stream_hidden from './20261105_081531_stream_hidden';

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
    name: '20261105_011354_hero_photos',
  },
  {
    up: migration_20261105_012459_stream_media.up,
    down: migration_20261105_012459_stream_media.down,
    name: '20261105_012459_stream_media',
  },
  {
    up: migration_20261105_012946_media_fit.up,
    down: migration_20261105_012946_media_fit.down,
    name: '20261105_012946_media_fit',
  },
  {
    up: migration_20261105_013331_drop_door_fields.up,
    down: migration_20261105_013331_drop_door_fields.down,
    name: '20261105_013331_drop_door_fields',
  },
  {
    up: migration_20261105_052747_hero_stage.up,
    down: migration_20261105_052747_hero_stage.down,
    name: '20261105_052747_hero_stage',
  },
  {
    up: migration_20261105_065118_hero_bands.up,
    down: migration_20261105_065118_hero_bands.down,
    name: '20261105_065118_hero_bands',
  },
  {
    up: migration_20261105_070136_step_clip.up,
    down: migration_20261105_070136_step_clip.down,
    name: '20261105_070136_step_clip',
  },
  {
    up: migration_20261105_081531_stream_hidden.up,
    down: migration_20261105_081531_stream_hidden.down,
    name: '20261105_081531_stream_hidden'
  },
];
