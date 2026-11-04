import * as migration_20261104_080302_initial from './20261104_080302_initial'

export const migrations = [
  {
    up: migration_20261104_080302_initial.up,
    down: migration_20261104_080302_initial.down,
    name: '20261104_080302_initial',
  },
]
