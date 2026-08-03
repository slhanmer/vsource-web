import React, { useCallback, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera, faTimesCircle, faCircle } from '@fortawesome/free-solid-svg-icons'
import Button from './Button'

import './styles/camera.scss'

/**
 * Props for the Camera component.
 *
 * @property onCapture - Called with the captured JPEG image as a base64 data-URL string
 * @property size - Icon and feed size variant: `'small'` or `'large'` (default: `'large'`)
 */
interface CameraProps {
  onCapture: (imageSrc: string) => void
  buttonLabel?: string
  size?: 'small' | 'large'
}

export const Camera: React.FC<CameraProps> = ({ onCapture, size = 'large' }) => {
  const webcamRef = useRef<Webcam>(null)
  const [cameraEnabled, setCameraEnabled] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot()
      if (imageSrc) {
        setCapturedImage(imageSrc)
        onCapture(imageSrc)
      } else {
        setCameraError('Unable to capture image')
      }
    }
  }, [onCapture])

  const toggleCamera = () => {
    setCameraError(null)
    setCapturedImage(null)
    setCameraEnabled((prev) => !prev)
  }

  return (
    <div className={`camera-overlay-wrapper ${cameraEnabled && !capturedImage ? 'active' : ''}`}>
      {cameraEnabled && !capturedImage && (
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: 'environment' }}
          onUserMedia={() => console.log('Webcam stream acquired')}
          onUserMediaError={(err) => {
            console.error('Webcam error', err)
            setCameraError('Camera access denied or not supported.')
            setCameraEnabled(false)
          }}
          className="camera-feed"
        />
      )}

      {cameraError && (
        <div className="camera-error">
          <p>{cameraError}</p>
        </div>
      )}

      <div className="overlay-buttons">
        <Button
          className={size === 'small' ? 'small' : ''}
          variant="icon-only"
          aria-label={cameraEnabled && !capturedImage ? 'Close camera' : 'Open camera'}
          icon={
            cameraEnabled && !capturedImage ? (
              <FontAwesomeIcon icon={faTimesCircle} />
            ) : (
              <FontAwesomeIcon
                icon={faCamera}
                className={size === 'small' ? 'small' : ''}
                style={{ fontSize: size === 'small' ? '25px' : '40px' }}
              />
            )
          }
          handleClick={toggleCamera}
        />

        {cameraEnabled && !capturedImage && (
          <Button
            variant="icon-only"
            aria-label="Capture photo"
            icon={<FontAwesomeIcon icon={faCircle} />}
            handleClick={capture}
          />
        )}
      </div>
    </div>
  )
}
