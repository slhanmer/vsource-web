import { planDeploy, stillPending } from '../deploy-plan'

const ALL = ['20261010_initial', '20261011_contact', '20261012_menu']

describe('planDeploy', () => {
  it('runs every migration on a new database with no migrations table', () => {
    expect(planDeploy({ migrations: ALL, recorded: null })).toEqual({
      action: 'migrate',
      pending: ALL,
      unknown: [],
    })
  })

  it('refuses a database that still has the dev-push row', () => {
    /*
     * Payload's migrate prompts on this row and, with nobody to answer,
     * exits 0 having run nothing — a green build over a broken site.
     */
    const recorded = [
      { name: 'dev', batch: -1 },
      { name: '20261010_initial', batch: 1 },
    ]
    expect(planDeploy({ migrations: ALL, recorded })).toEqual({ action: 'refuse-dev' })
  })

  it('refuses a dev-pushed database that records nothing else', () => {
    expect(planDeploy({ migrations: ALL, recorded: [{ name: 'dev', batch: -1 }] })).toEqual({
      action: 'refuse-dev',
    })
  })

  it('lists only what is not yet recorded', () => {
    const recorded = [
      { name: '20261010_initial', batch: 1 },
      { name: '20261011_contact', batch: 2 },
    ]
    expect(planDeploy({ migrations: ALL, recorded })).toEqual({
      action: 'migrate',
      pending: ['20261012_menu'],
      unknown: [],
    })
  })

  it('has nothing to run on an up-to-date database', () => {
    const recorded = ALL.map((name) => ({ name, batch: 1 }))
    expect(planDeploy({ migrations: ALL, recorded })).toMatchObject({ pending: [] })
  })

  it('names migrations the database has and this code does not, without refusing', () => {
    const recorded = [...ALL, '20261020_newer'].map((name) => ({ name, batch: 1 }))
    expect(planDeploy({ migrations: ALL, recorded })).toEqual({
      action: 'migrate',
      pending: [],
      unknown: ['20261020_newer'],
    })
  })

  it('treats an empty migrations table as nothing applied yet', () => {
    expect(planDeploy({ migrations: ALL, recorded: [] })).toMatchObject({ pending: ALL })
  })
})

describe('stillPending', () => {
  it('is what migrate failed to record', () => {
    expect(stillPending(ALL, [{ name: '20261010_initial', batch: 1 }])).toEqual([
      '20261011_contact',
      '20261012_menu',
    ])
  })
})
