//TODO: Add support for bolding / italics etc

'use client'

import React, { useState, ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faListUl,
  faLink,
  faSquareMinus,
  faUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons'
import Button from './Button'
import Input from './Input'
import Modal from './Modal'
import Spacer from './Spacer'

import './styles/editorToolbar.scss'

const BLANK_TOKEN = '<<B:>>'
const LINEBREAK_TOKEN = '<<BP:>>'

/**
 * A link captured by the toolbar, handed to the caller to persist.
 *
 * @property linkText - The text that was selected in the textarea
 * @property linkURL - The URL the user entered
 */
export interface EditorToolbarLink {
  linkText: string
  linkURL: string
}

/**
 * Props for the EditorToolbar component.
 *
 * The toolbar edits whatever `<textarea name={targetName}>` is on the page and
 * reports the new value through `onTextChange` — it holds no document state of
 * its own. Persistence is entirely the caller's business: in the portal that
 * means writing back to the form-builder store, here it means whatever the
 * consuming form does.
 *
 * @property targetName - `name` of the textarea to operate on (matches Input's `name`)
 * @property onTextChange - Called with the full new textarea value after any insertion.
 *   Blank insertions arrive with newlines already encoded as `<<BP:>>`.
 * @property onAddLink - Called when the user saves a link over the current selection.
 *   The caller assigns the id and persists it. Omit to disable saving.
 * @property linkPreview - Rendered inside the link modal while a link is pending.
 *   Receives the pending selection and the URL typed so far so the caller can
 *   render its own preview (the portal renders resolved question text here).
 * @property hasLinks - Show the add-link button (default: `true`)
 * @property hasBlanks - Show the add-blank button (default: `true`)
 * @property hasBulletPoints - Show the add-bullet button (default: `true`)
 */
interface EditorToolbarProps {
  targetName: string
  onTextChange?: (newVal: string) => void
  onAddLink?: (link: EditorToolbarLink) => void
  linkPreview?: (pending: { text: string; url: string }) => ReactNode
  hasLinks?: boolean
  hasBlanks?: boolean
  hasBulletPoints?: boolean
}

/**
 * Toolbar for the large-textarea variant of `Input` (`withEditor`).
 *
 * Inserts bullets, blank tokens and links at the caret of the target textarea.
 * Deliberately store-free: the portal's form-builder wiring lives in the props,
 * so the component can be shared across apps that have no concept of questions.
 */
export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  targetName,
  onTextChange,
  onAddLink,
  linkPreview,
  hasLinks = true,
  hasBlanks = true,
  hasBulletPoints = true,
}) => {
  const [showLinkEditor, setShowLinkEditor] = useState<boolean>(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [pendingLink, setPendingLink] = useState<{
    text: string
    start: number
    end: number
  } | null>(null)

  const getTextarea = () =>
    document.querySelector(`textarea[name="${targetName}"]`) as HTMLTextAreaElement | null

  const handleAddBullet = () => {
    const textarea = getTextarea()
    if (!textarea) return

    const { selectionStart, selectionEnd, value } = textarea
    const before = value.substring(0, selectionStart)
    const needsNewline = before.length > 0 && !before.endsWith('\n')
    const insertion = `${needsNewline ? '\n' : ''}• `

    const newValue = value.substring(0, selectionStart) + insertion + value.substring(selectionEnd)

    // restore cursor
    const cursorPosition = selectionStart + insertion.length
    textarea.value = newValue
    textarea.setSelectionRange(cursorPosition, cursorPosition)
    textarea.focus()

    onTextChange?.(newValue)
  }

  const handleAddBlank = () => {
    const textarea = getTextarea()
    if (!textarea) return

    const { selectionStart, selectionEnd, value } = textarea

    const newValue =
      value.substring(0, selectionStart) + BLANK_TOKEN + value.substring(selectionEnd)

    // restore cursor after token
    const cursorPosition = selectionStart + BLANK_TOKEN.length
    textarea.value = newValue
    textarea.setSelectionRange(cursorPosition, cursorPosition)
    textarea.focus()

    // convert newlines for storage
    const storedValue = newValue.replaceAll('\n', LINEBREAK_TOKEN)

    onTextChange?.(storedValue)
  }

  const clearTextareaSelection = () => {
    if (!pendingLink) return

    const textarea = getTextarea()
    if (!textarea) return

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(pendingLink.end, pendingLink.end)
    }, 0)
  }

  const handleClearLinkSelection = () => {
    setShowLinkEditor(false)
    setPendingLink(null)
    setLinkUrl('')
    clearTextareaSelection()
  }

  const handleAddLink = () => {
    const textarea = getTextarea()
    if (!textarea) return

    const { selectionStart, selectionEnd, value } = textarea
    if (selectionStart === selectionEnd) return

    const selectedText = value.substring(selectionStart, selectionEnd)

    setPendingLink({
      text: selectedText,
      start: selectionStart,
      end: selectionEnd,
    })

    setShowLinkEditor(true)
  }

  const handleSaveLink = () => {
    if (!pendingLink || !linkUrl) return

    onAddLink?.({ linkText: pendingLink.text, linkURL: linkUrl })

    setShowLinkEditor(false)
    setPendingLink(null)
    setLinkUrl('')
  }

  return (
    <div className="editor-toolbar">
      <Modal
        title="Add Link"
        isOpen={showLinkEditor}
        onClose={handleClearLinkSelection}
        className="linking-modal"
      >
        <div className="url-buttons">
          <Input
            name="url"
            label="URL"
            placeholder="Add a url to link to here ..."
            hideLabel={false}
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
          />
          <Button
            label="check link"
            variant="icon-only"
            icon={<FontAwesomeIcon icon={faUpRightFromSquare} />}
            disabled={!linkUrl.trim()}
            handleClick={() => {
              if (!linkUrl.trim()) return

              const normalized = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`

              window.open(normalized, '_blank', 'noopener,noreferrer')
            }}
          />
        </div>

        {pendingLink && linkPreview?.({ text: pendingLink.text, url: linkUrl || '#' })}

        <Spacer size={2} />
        <div className="flex-container spread full-width">
          <Button label="cancel" variant="cancel" handleClick={handleClearLinkSelection} />
          <Button label="Save" handleClick={handleSaveLink} disabled={!linkUrl.trim()} />
        </div>
        <Spacer size={0.5} />
        <div className="error-text" style={{ visibility: !linkUrl.trim() ? 'visible' : 'hidden' }}>
          Enter a valid url to save the link
        </div>
      </Modal>

      {hasBulletPoints && (
        <Button
          variant="icon-only"
          icon={<FontAwesomeIcon icon={faListUl} />}
          label="Add bullet"
          handleClick={handleAddBullet}
        />
      )}
      {hasLinks && (
        <Button
          variant="icon-only"
          icon={<FontAwesomeIcon icon={faLink} />}
          label="Add link"
          handleClick={handleAddLink}
        />
      )}
      {hasBlanks && (
        <Button
          variant="icon-only"
          icon={<FontAwesomeIcon icon={faSquareMinus} />}
          label="Add blank"
          handleClick={handleAddBlank}
        />
      )}
    </div>
  )
}

export default EditorToolbar
