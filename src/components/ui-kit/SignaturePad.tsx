import React, { useRef, useState, useEffect, RefObject } from 'react'
import Modal from './Modal'
import Button from './Button'
import { usePreventScroll } from '@hooks'

import './styles/signaturePad.scss'

/**
 * Props for the SignaturePad component.
 *
 * @property onSave - Called with the trimmed PNG data-URL of the drawn signature when the user saves
 * @property onClear - Called when the canvas is cleared
 * @property showCanvas - Controlled open state for the modal. When provided the component is fully
 *   controlled and the "Click To Sign" button no longer toggles the modal internally.
 * @property focusRef - Ref attached to the outer container for programmatic focus management
 * @property required - Applies required styling to the trigger button (default: `false`)
 * @property disabled - Prevents opening the signature modal (default: `false`)
 * @property initialValue - Pre-populate the canvas with an existing signature data-URL
 */
interface SignatureProps {
  showCanvas?: boolean

  onSave: (signatureDataUrl: string) => void
  onClear?: () => void
  focusRef?: RefObject<any>
  required?: boolean
  disabled?: boolean
  initialValue?: string
}

export const SignaturePad: React.FC<SignatureProps> = ({
  onSave,
  onClear,
  showCanvas,
  focusRef,
  required = false,
  disabled = false,
  initialValue,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [modalOpen, setModalOpen] = useState(showCanvas ?? false)
  const [signature, setSignature] = useState<string>(initialValue || '')
  const [hasDrawn, setHasDrawn] = useState(false)
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 })

  const isControlled = showCanvas !== undefined
  const effectiveOpen = isControlled ? showCanvas : modalOpen

  useEffect(() => {
    if (initialValue && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      const img = new Image()
      img.src = initialValue
      img.onload = () => {
        ctx?.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
        ctx?.drawImage(img, 0, 0, canvasRef.current!.width, canvasRef.current!.height)
      }
      setSignature(initialValue)
      setHasDrawn(true)
    }
  }, [initialValue])

  const updateCanvasDimensions = () => {
    if (canvasRef.current) {
      const container = canvasRef.current.parentElement as HTMLElement
      if (!container) return

      const width = container.offsetWidth // full width of container
      const height = container.offsetHeight // full height of container

      canvasRef.current.width = width
      canvasRef.current.height = height

      setCanvasDimensions({ width, height })
    }
  }

  const drawPlaceholder = () => {
    if (canvasRef.current && canvasDimensions.width > 0 && canvasDimensions.height > 0) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        context.clearRect(0, 0, canvasDimensions.width, canvasDimensions.height)

        // Draw Bezier curve
        context.strokeStyle = '#d0d0d0'
        context.lineWidth = 4
        context.beginPath()
        context.moveTo(canvasDimensions.width * 0.15, canvasDimensions.height * 0.75)
        context.bezierCurveTo(
          canvasDimensions.width * 0.3,
          canvasDimensions.height * 0.9,
          canvasDimensions.width * 0.7,
          canvasDimensions.height * 0.7,
          canvasDimensions.width * 0.8,
          canvasDimensions.height * 0.8
        )
        context.stroke()
        context.closePath()

        // Draw "Sign here" text
        document.fonts.load('32px "Pacifico"').then(() => {
          context.save()
          context.translate(canvasDimensions.width * 0.16, canvasDimensions.height * 0.7)
          context.font = 'italic 60px "Pacifico", cursive'
          context.fillStyle = '#d0d0d0'
          context.fillText('Sign here', 0, 0)
          context.restore()
        })
      }
    }
  }

  // when modal opens, set up resize/orientation listeners
  useEffect(() => {
    if (!effectiveOpen) return

    const handleResize = () => {
      updateCanvasDimensions()
      drawPlaceholder()
    }

    // Run once on open
    handleResize()

    // Listen for device resize/orientation changes
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveOpen])

  usePreventScroll(effectiveOpen)

  useEffect(() => {
    if (effectiveOpen) {
      setTimeout(() => {
        updateCanvasDimensions()
        drawPlaceholder()
      }, 50)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveOpen])

  useEffect(() => {
    // Ensure placeholder is drawn on the initial render when canvas dimensions are set
    if (canvasDimensions.width > 0 && canvasDimensions.height > 0) {
      drawPlaceholder()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasDimensions])

  const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
    if (canvasRef.current && !hasDrawn) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        context.clearRect(0, 0, canvasDimensions.width, canvasDimensions.height)
        context.beginPath()
      }
    }
    setIsDrawing(true)
    setHasDrawn(true)
    draw(event)
  }

  const endDrawing = () => {
    setIsDrawing(false)
    if (canvasRef.current) {
      canvasRef.current.getContext('2d')?.beginPath()
    }
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return

    const context = canvasRef.current.getContext('2d')
    if (!context) return

    const rect = canvasRef.current.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

    context.lineWidth = 4
    context.lineCap = 'round'
    context.strokeStyle = '#000000'

    context.lineTo(clientX - rect.left, clientY - rect.top)
    context.stroke()
    context.beginPath()
    context.moveTo(clientX - rect.left, clientY - rect.top)
  }

  const clearCanvas = () => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d', { willReadFrequently: true })
      if (!context) return

      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      setHasDrawn(false)
      setSignature('')

      drawPlaceholder()

      if (onClear) onClear()
    }
  }

  const trimWhitespaceFromImage = (imageSrc: string, callback: (trimmedImage: string) => void) => {
    const image = new Image()
    image.src = imageSrc
    image.onload = () => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      canvas.width = image.width
      canvas.height = image.height
      context?.drawImage(image, 0, 0)

      const imageData = context?.getImageData(0, 0, canvas.width, canvas.height)
      if (!imageData) return

      const { data, width, height } = imageData

      let top = height,
        bottom = 0,
        left = width,
        right = 0

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const index = (y * width + x) * 4
          const alpha = data[index + 3]

          if (alpha > 0) {
            if (y < top) top = y
            if (y > bottom) bottom = y
            if (x < left) left = x
            if (x > right) right = x
          }
        }
      }

      const croppedWidth = right - left + 1
      const croppedHeight = bottom - top + 1

      const trimmedCanvas = document.createElement('canvas')
      trimmedCanvas.width = croppedWidth
      trimmedCanvas.height = croppedHeight

      const trimmedContext = trimmedCanvas.getContext('2d')
      trimmedContext?.drawImage(
        canvas,
        left,
        top,
        croppedWidth,
        croppedHeight,
        0,
        0,
        croppedWidth,
        croppedHeight
      )

      const trimmedImage = trimmedCanvas.toDataURL('image/png')
      callback(trimmedImage)
    }
  }

  const handleSaveClick = () => {
    if (canvasRef.current) {
      const signatureDataUrl = canvasRef.current.toDataURL()
      trimWhitespaceFromImage(signatureDataUrl, (trimmedImage) => {
        setSignature(trimmedImage)
        if (!isControlled) setModalOpen(false)
        onSave(trimmedImage)
      })
    }
  }

  return (
    <div className="signature-pad-container" ref={focusRef}>
      <div
        onClick={() => {
          if (disabled) return
          if (!isControlled) setModalOpen(true)
        }}
      >
        {signature ? (
          <div className="flex-container column">
            <img className="signature-preview" src={signature} alt="User's signature" />
            <span className="update-signature">Update</span>
          </div>
        ) : (
          <div>
            <Button
              label="Click To Sign"
              normalCase
              variant="fingerprint"
              required={required}
              disabled={disabled}
            />
          </div>
        )}
      </div>

      <Modal
        className="signature-modal"
        title="Please sign below"
        isOpen={effectiveOpen || false}
        onClose={() => setModalOpen(false)}
        fullScreen
        // closeOnOverlay={false}
      >
        <canvas
          ref={canvasRef}
          width={canvasDimensions.width}
          height={canvasDimensions.height}
          className="signature-canvas"
          onMouseDown={startDrawing}
          onMouseUp={endDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={endDrawing}
          onTouchMove={draw}
        />
        <div className="signature-buttons-container">
          <Button
            label="Clear"
            variant="secondary"
            style={{ width: '150px' }}
            handleClick={clearCanvas}
          />

          <Button
            label="Save"
            className="btn-primary"
            style={{ width: '150px' }}
            handleClick={handleSaveClick}
            disabled={!hasDrawn}
          />
        </div>
      </Modal>
    </div>
  )
}
