import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useEffect, useState } from 'react'
import type { TableColumn } from '@types'
import Button from './Button'
import Choice from './Choice'
import { Dropdown } from './DropDown'
import Input from './Input'
import { ProgressBar } from './ProgressBar'
import { SlideSwitch } from './SlideSwitch'
import { Table } from './Table'
import '@/styles/global.scss'

/**
 * Showcase/Overview — a designed sheet of SAUCE, for the SAUCE card on /built.
 *
 * Real components, on the site's own DARK theme (global.scss tokens with
 * data-theme="dark"), not the preview decorator's tenant palette. The sheet is
 * 1280×800 CSS pixels; the /built screenshot is taken of `.sauce-sheet` at a
 * device scale of 1.25, which makes the 1600×1000 file.
 *
 * ⚠ EVERY VISIBLE STRING IS INVENTED AND NEUTRAL. No client names, no client
 * data, nothing medical: this image is public. If you change a string, check it
 * against that rule and update the list in docs/briefs/built-trim.log.md.
 */
const meta: Meta = {
  title: 'Showcase/Overview',
  parameters: { layout: 'fullscreen' },
}
export default meta

type Job = { id: string; name: string; stream: string; status: string; updated: string }

const JOBS: Job[] = [
  { id: '1', name: 'Booking flow', stream: 'Websites', status: 'Live', updated: '2 Nov' },
  { id: '2', name: 'Stock counts', stream: 'Software', status: 'Building', updated: '4 Nov' },
  { id: '3', name: 'Gait trials', stream: 'Robotics', status: 'Testing', updated: '5 Nov' },
  { id: '4', name: 'Rostering', stream: 'Software', status: 'Scoping', updated: '5 Nov' },
]

const COLUMNS: TableColumn<Job>[] = [
  { key: 'name', header: 'Job', width: '1.4fr', sortable: true, cell: (r) => r.name },
  { key: 'stream', header: 'Stream', width: '1fr', sortable: true, cell: (r) => r.stream },
  { key: 'status', header: 'Status', width: '1fr', cell: (r) => r.status },
  { key: 'updated', header: 'Updated', width: '0.8fr', cell: (r) => r.updated },
]

const STREAMS = [
  { label: 'Software', value: 'software' },
  { label: 'Robotics', value: 'robotics' },
  { label: 'Websites', value: 'websites' },
]

/* The site's faces, which next/font serves on the site itself. Storybook has
   no next/font, so the sheet fetches them for the screenshot only. */
const FONTS =
  'https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=Newsreader:opsz,wght@6..72,400;6..72,500&display=swap'

function Sheet() {
  const [name, setName] = useState('Stock counts')
  const [email, setEmail] = useState('hello@example.com')
  const [stream, setStream] = useState('software')
  const [notify, setNotify] = useState(true)
  const [weekly, setWeekly] = useState(true)
  const [plan, setPlan] = useState('monthly')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark')
    document.documentElement.style.overflow = 'auto'
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = FONTS
    document.head.appendChild(link)
    return () => link.remove()
  }, [])

  return (
    <div className="sauce-sheet">
      <style>{`
        .sauce-sheet {
          width: 1280px; height: 800px; box-sizing: border-box; padding: 48px 56px;
          background: var(--surface-page); color: var(--text-primary);
          font-family: 'IBM Plex Sans', sans-serif;
          display: grid; grid-template-columns: 1fr 1fr 1.3fr; grid-template-rows: auto auto;
          align-content: center; align-items: start; gap: 24px 24px;
        }
        .sauce-sheet__head { grid-column: 1 / -1; display: flex; align-items: baseline; gap: 20px; }
        .sauce-sheet__mark { font-family: 'Chakra Petch', sans-serif; font-weight: 600; font-size: 44px; letter-spacing: 0.04em; }
        .sauce-sheet__note { font-family: 'IBM Plex Mono', monospace; font-size: 14px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--route-active); }
        .sauce-panel {
          background: var(--surface-card); border-radius: 10px; padding: 28px;
          box-shadow: inset 0 1px 0 var(--chrome-edge);
          display: flex; flex-direction: column; gap: 18px; min-width: 0;
        }
        .sauce-panel__title { font-family: 'IBM Plex Mono', monospace; font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.75; margin: 0 0 4px; }
        .sauce-row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
      `}</style>

      <div className="sauce-sheet__head">
        <span className="sauce-sheet__mark">SAUCE</span>
        <span className="sauce-sheet__note">Component library · dark theme</span>
      </div>

      <section className="sauce-panel">
        <p className="sauce-panel__title">Inputs</p>
        <Input
          label="Job name"
          name="job"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
        <Input
          label="Contact email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        <Input label="Notes" name="notes" placeholder="Anything we should know" fullWidth />
        <Dropdown
          label="Stream"
          options={STREAMS}
          value={stream}
          onSelect={setStream}
          fullWidth
          id="sauce-stream"
        />
      </section>

      <section className="sauce-panel">
        <p className="sauce-panel__title">Actions and choices</p>
        <div className="sauce-row">
          <Button label="Save" variant="basic" />
          <Button label="Get started" variant="cta" />
        </div>
        <div className="sauce-row">
          <Button label="Cancel" variant="secondary" />
          <Button label="Delete" variant="danger" />
        </div>
        <Choice
          name="notify"
          label="Email me when it changes"
          checked={notify}
          onChange={(e) => setNotify(e.target.checked)}
        />
        <Choice
          name="weekly"
          label="Weekly summary"
          checked={weekly}
          onChange={(e) => setWeekly(e.target.checked)}
        />
        <div className="sauce-row">
          <Choice
            type="radio"
            name="plan"
            value="monthly"
            label="Monthly"
            checked={plan === 'monthly'}
            onChange={() => setPlan('monthly')}
          />
          <Choice
            type="radio"
            name="plan"
            value="yearly"
            label="Yearly"
            checked={plan === 'yearly'}
            onChange={() => setPlan('yearly')}
          />
        </div>
        <div className="sauce-row">
          <SlideSwitch aria-label="Live preview" checked={notify} onChange={setNotify} />
          <span>Live preview</span>
        </div>
      </section>

      <section className="sauce-panel">
        <p className="sauce-panel__title">Table</p>
        <Table columns={COLUMNS} rows={JOBS} rowKey={(r) => r.id} selectedRowKey="2" />
        <p className="sauce-panel__title">Progress</p>
        <ProgressBar progress={68} />
      </section>
    </div>
  )
}

export const Overview: StoryObj = {
  render: () => <Sheet />,
}
