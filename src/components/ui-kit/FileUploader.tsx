import React, { useId, useRef, useState } from 'react'
import Button from './Button'
import { Camera } from './Camera'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { useViewport } from '@hooks'
import { getDisplayFileName } from '@utils'

import './styles/fileUploader.scss'

/**
 * Props for the FileUploader component.
 *
 * @property label - Drop zone / button label (default: `'Upload file'`)
 * @property multiple - Allow selecting multiple files (default: `false`)
 * @property buttonName - Override label shown on the desktop drop-zone button
 * @property disabled - Disable all upload interaction (default: `false`)
 * @property onChange - Called with the current `File[]` array after each add or remove
 * @property required - Apply required styling to the drop zone (default: `false`)
 * @property withFindButton - Show an additional "Find File" button below the drop zone
 * @property renameFile - Transform each `File` before it is stored (e.g. to normalise filenames)
 * @property showUploads - Render a thumbnail list of selected files with remove buttons
 * @property onRemove - Called with the index of the removed file when a thumbnail is dismissed
 */
interface FileUploaderProps {
  label?: string
  multiple?: boolean
  buttonName?: string
  disabled?: boolean
  onChange?: (files: File[]) => void
  accept?: string
  required?: boolean
  withFindButton?: boolean
  renameFile?: (file: File) => File
  showUploads?: boolean
  onRemove?: (index: number) => void
}

function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(',')
  const mimeMatch = arr[0].match(/:(.*?);/)
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg'
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) u8arr[n] = bstr.charCodeAt(n)

  return new File([u8arr], filename, { type: mime })
}

const FileUploader: React.FC<FileUploaderProps> = ({
  label = 'Upload file',
  multiple = false,
  buttonName,
  disabled = false,
  onChange,
  accept = '*/*',
  required = false,
  withFindButton = false,
  renameFile,
  showUploads,
  onRemove,
}) => {
  const isMobile = useViewport()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const inputId = useId()

  const [files, setFiles] = useState<File[]>([])

  const showUploadBox = multiple || files.length === 0

  const handleFiles = (selected: FileList | null) => {
    if (!selected) return

    let arr = Array.from(selected)

    if (renameFile) {
      arr = arr.map((file) => renameFile(file))
    }

    const newFiles = multiple ? [...files, ...arr] : arr

    setFiles(newFiles)
    onChange?.(newFiles)

    if (!multiple && inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index)
    setFiles(updated)
    onChange?.(updated)
    onRemove?.(index)

    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const openFileDialog = () => {
    if (!disabled) {
      inputRef.current?.click()
    }
  }

  return (
    <div
      className={`file-uploader ${disabled ? 'disabled' : ''} ${required ? 'required' : ''}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        hidden
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        disabled={disabled}
        accept={accept}
      />
      {showUploadBox &&
        (isMobile ? (
          <label
            htmlFor={disabled ? undefined : inputId}
            className={`mobile-upload-box ${disabled ? 'disabled' : ''} ${required ? 'required' : ''}`}
          >
            {files.length > 0 ? 'Add more files' : label}
          </label>
        ) : (
          <label
            htmlFor={disabled ? undefined : inputId}
            className={`upload-box ${disabled ? 'disabled' : ''} ${required ? 'required' : ''}`}
          >
            <FontAwesomeIcon className="upload-icon" icon={faUpload} />
            <span className="upload-icon-label">
              {files.length > 0 ? 'Add more files' : buttonName || label}
            </span>
          </label>
        ))}

      {showUploads && (
        <ul className={`file-list ${files.length > 0 ? 'show' : ''}`}>
          {files.map((file, i) => (
            <li key={i} className="enter">
              <div className="upload-preview">
                <img
                  src={URL.createObjectURL(file)}
                  alt={files[0].name}
                  className="upload-thumbnail"
                />
              </div>
              <span className="file-name" data-fullname={file.name}>
                <span className="file-name__text">{getDisplayFileName(file.name)}</span>
              </span>

              <Button
                label=""
                variant="close"
                handleClick={() => removeFile(i)}
                className="small"
              />
            </li>
          ))}
        </ul>
      )}
      <div className={isMobile ? 'flex-container spaced' : 'flex-container column'}>
        {withFindButton && (
          <Button
            label="Find File"
            variant={isMobile ? 'icon-only' : 'text-only'}
            normalCase
            icon={<FontAwesomeIcon icon={faUpload} />}
            handleClick={openFileDialog}
          />
        )}
        {isMobile && (
          <Camera
            size="large"
            onCapture={(imageBase64) => {
              let file = base64ToFile(imageBase64, 'id-photo.jpg')

              if (renameFile) {
                file = renameFile(file)
              }

              setFiles([file])
              onChange?.([file])
            }}
          />
        )}
      </div>
    </div>
  )
}

export default FileUploader
