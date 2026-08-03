import React, { useRef, useState } from 'react'
import Spacer from './Spacer'
import Button from './Button'
import { useViewport } from '@hooks'
import './styles/tabbedContainer.scss'

/**
 * Props for the TabbedContainer component.
 *
 * @property tabs - Tab definitions. Each entry provides a `label` and an optional `icon`
 *   (icons are shown on mobile; labels on desktop).
 * @property content - Panel content for each tab. Index must align with `tabs`.
 * @property statuses - Optional status code per tab, used to apply visual indicators:
 *   - `0` — default (no indicator)
 *   - `1` — complete (green)
 *   - `2` — incomplete (orange/warning)
 *   - `3` — disabled (not clickable)
 * @property activeTab - Controlled active tab index. When provided, the component is controlled.
 * @property onTabChange - Called with the new index when a tab is clicked (controlled mode)
 * @property showSaveButton - Render a save button below the active tab's content
 * @property saveButtonName - Label for the save button (default: `'save'`)
 * @property saveDisabled - Disable the save button
 *
 * @example
 * <TabbedContainer
 *   tabs={[{ label: 'Details' }, { label: 'Settings' }]}
 *   content={[<DetailsPanel />, <SettingsPanel />]}
 *   statuses={[1, 0]}
 * />
 */
interface TabbedContainerProps {
  tabs: {
    label: string
    icon?: React.ReactNode
  }[]
  content: React.ReactNode[]
  statuses?: (0 | 1 | 2 | 3)[]
  saveDisabled?: boolean
  showSaveButton?: boolean
  saveButtonName?: string
  activeTab?: number
  onTabChange?: (index: number) => void
}

const mapStatusToClass = (status: number) => {
  switch (status) {
    case 0:
      return 'default'
    case 1:
      return 'complete'
    case 2:
      return 'incomplete'
    case 3:
      return 'disabled'
    default:
      return 'default'
  }
}

const TabbedContainer: React.FC<TabbedContainerProps> = ({
  tabs,
  content,
  statuses,
  saveDisabled = false,
  showSaveButton,
  saveButtonName,
  activeTab,
  onTabChange,
}) => {
  const isMobile = useViewport()

  const [internalActiveTab, setInternalActiveTab] = useState(0)

  const isControlled = activeTab !== undefined
  const currentTab = isControlled ? activeTab : internalActiveTab

  // Refs to the tab elements so keyboard nav can move DOM focus as selection moves.
  // Shared by both layouts (only one layout is mounted at a time).
  const tabRefs = useRef<(HTMLDivElement | null)[]>([])

  const isTabDisabled = (index: number) => statuses?.[index] === 3

  const handleSubmit = () => {
    const formElement = document.querySelector(`#form-${currentTab}`)
    if (formElement) {
      ;(formElement as HTMLFormElement).requestSubmit()
    } else {
      console.error(`No form element found for tab ${currentTab}`)
    }
  }

  const activateTab = (index: number) => {
    if (isTabDisabled(index)) return
    if (isControlled) {
      onTabChange?.(index)
    } else {
      setInternalActiveTab(index)
    }
  }

  // Find the next non-disabled tab in `dir` (+1 / -1), wrapping at the ends.
  // Returns the current index if every other tab is disabled.
  const nextEnabledIndex = (from: number, dir: 1 | -1): number => {
    const count = tabs.length
    for (let step = 1; step <= count; step++) {
      const candidate = (from + dir * step + count * step) % count
      if (!isTabDisabled(candidate)) return candidate
    }
    return from
  }

  const firstEnabledIndex = (): number => {
    for (let i = 0; i < tabs.length; i++) if (!isTabDisabled(i)) return i
    return currentTab
  }

  const lastEnabledIndex = (): number => {
    for (let i = tabs.length - 1; i >= 0; i--) if (!isTabDisabled(i)) return i
    return currentTab
  }

  // Shared keyboard handler — WAI-ARIA tabs pattern, automatic activation
  // (focus follows selection). Used by both desktop and mobile tab rows so the
  // behaviour is defined once. Arrow keys skip disabled tabs and wrap.
  const handleTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    let target: number | null = null

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        target = nextEnabledIndex(index, 1)
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        target = nextEnabledIndex(index, -1)
        break
      case 'Home':
        target = firstEnabledIndex()
        break
      case 'End':
        target = lastEnabledIndex()
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        activateTab(index)
        return
      default:
        return
    }

    if (target !== null) {
      e.preventDefault()
      activateTab(target)
      tabRefs.current[target]?.focus()
    }
  }

  return (
    <div className="tabbed-container">
      {isMobile ? (
        <div className="mobile-tab-layout">
          <div className="mobile-tab-list" role="tablist" aria-label="Content sections">
            {tabs.map((tab, index) => {
              const statusClass = statuses ? mapStatusToClass(statuses[index]) : 'default'
              const disabled = statusClass === 'disabled'
              const selected = index === currentTab

              return (
                <React.Fragment key={index}>
                  <div
                    ref={(el) => {
                      tabRefs.current[index] = el
                    }}
                    role="tab"
                    id={`tab-${index}`}
                    aria-selected={selected}
                    aria-controls={`tabpanel-${index}`}
                    aria-disabled={disabled || undefined}
                    aria-label={tab.label}
                    tabIndex={selected ? 0 : -1}
                    className={`mobile-tab ${selected ? 'active' : ''} ${statusClass}`}
                    onClick={() => activateTab(index)}
                    onKeyDown={(e) => handleTabKeyDown(e, index)}
                  >
                    <span aria-hidden="true">{tab.icon}</span>
                  </div>
                  {index !== tabs.length - 1 && (
                    // Decorative connector between tabs — not interactive, hidden from AT.
                    <div
                      aria-hidden="true"
                      className={`arrow ${index === currentTab ? 'active' : ''} ${statusClass}`}
                    />
                  )}
                </React.Fragment>
              )
            })}
          </div>

          <div className="mobile-tab-content">
            <h2 className="mobile-tab-title">{tabs[currentTab].label}</h2>

            {tabs.map((tab, index) => (
              <div
                key={index}
                role="tabpanel"
                id={`tabpanel-${index}`}
                aria-labelledby={`tab-${index}`}
                hidden={index !== currentTab}
              >
                {index === currentTab && content[index]}
              </div>
            ))}

            {showSaveButton && (
              <>
                <Spacer size={1} />
                <Button
                  label={saveButtonName ?? 'save'}
                  handleClick={handleSubmit}
                  disabled={saveDisabled}
                />
                <Spacer size={1} />
              </>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="tab-header-container" role="tablist" aria-label="Content sections">
            {tabs.map((tab, index) => {
              const statusClass = statuses ? mapStatusToClass(statuses[index]) : 'default'
              const disabled = statusClass === 'disabled'
              const selected = index === currentTab

              return (
                <div
                  ref={(el) => {
                    tabRefs.current[index] = el
                  }}
                  role="tab"
                  id={`tab-${index}`}
                  aria-selected={selected}
                  aria-controls={`tabpanel-${index}`}
                  aria-disabled={disabled || undefined}
                  tabIndex={selected ? 0 : -1}
                  key={index}
                  className={`tab-header ${selected ? 'active' : ''} ${statusClass !== 'default' ? statusClass : ''}`}
                  style={{ zIndex: tabs.length - index }}
                  onClick={() => activateTab(index)}
                  onKeyDown={(e) => handleTabKeyDown(e, index)}
                >
                  <span className="tab-name">{tab.label}</span>
                  {index !== tabs.length - 1 && <div className="arrow" aria-hidden="true" />}
                </div>
              )
            })}
          </div>

          {tabs.map((tab, index) => (
            <div
              key={index}
              className="tab-content"
              role="tabpanel"
              id={`tabpanel-${index}`}
              aria-labelledby={`tab-${index}`}
              hidden={index !== currentTab}
            >
              {index === currentTab && (
                <>
                  {content[index]}

                  {showSaveButton && (
                    <div>
                      <Spacer size={1} />
                      <Button
                        label={saveButtonName ?? 'save'}
                        handleClick={handleSubmit}
                        disabled={saveDisabled}
                      />
                      <Spacer size={0.5} />
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  )
}

export default TabbedContainer
