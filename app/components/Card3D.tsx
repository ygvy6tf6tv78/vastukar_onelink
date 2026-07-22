'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

type Face = 'front' | 'info' | 'payment' | 'appointment' | 'doctor'

interface Card3DProps {
  currentFace: Face
  isFlipping?: boolean
  /** Duration in seconds – use longer for more rotation (e.g. 0.65 for 180°, ~1.3 for 360°, ~2 for 540°) so flip speed feels same */
  transitionDuration?: number
  onFaceChange?: (face: Face) => void
  faceFront: ReactNode
  faceInfo: ReactNode
  facePayment: ReactNode
  faceAppointment?: ReactNode
  faceDoctor?: ReactNode
}

const FLIP_DURATION_DEFAULT = 0.65
const FLIP_EASE = [0.22, 1, 0.36, 1] as const

export default function Card3D({
  currentFace,
  isFlipping = false,
  transitionDuration = FLIP_DURATION_DEFAULT,
  onFaceChange,
  faceFront,
  faceInfo,
  facePayment,
  faceAppointment,
  faceDoctor,
}: Card3DProps) {
  // front (0) -> info (180) -> payment (360) -> appointment (540)
  const getRotateY = () => {
    switch (currentFace) {
      case 'front':
        return 0
      case 'info':
        return 180
      case 'payment':
        return 360
      case 'appointment':
        // Keep appointment as a single clean flip from the front face.
        // (We still render the appointment face at rotateY=540 internally,
        // but the container rotation is what controls the user-visible spin.)
        return 180
      case 'doctor':
        return 180
      default:
        return 0
    }
  }

  return (
    <div
      className="relative w-full max-w-md mx-auto"
      style={{ perspective: '1000px', width: '100%', overflowAnchor: 'none' }}
    >
      {isFlipping && (
        <div
          className="absolute inset-0"
          style={{
            pointerEvents: 'none',
            touchAction: 'pan-y',
            zIndex: 100,
            backgroundColor: 'transparent'
          }}
        />
      )}
      <motion.div
        className="relative w-full"
        style={{ transformStyle: 'preserve-3d', minHeight: 580 }}
        animate={{ rotateY: getRotateY() }}
        transition={{
          duration: transitionDuration,
          ease: FLIP_EASE,
          type: 'tween'
        }}
      >
        {/* FRONT FACE - rotateY 0 */}
        <div
          className="relative w-full"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
            willChange: 'transform',
            minHeight: 580,
            opacity: currentFace === 'payment' || currentFace === 'appointment' || currentFace === 'doctor' ? 0 : 1,
            pointerEvents: currentFace === 'payment' || currentFace === 'appointment' || currentFace === 'doctor' || isFlipping ? 'none' : 'auto',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            zIndex: currentFace === 'front' ? 20 : currentFace === 'info' ? 10 : 1
          }}
        >
          {faceFront}
        </div>

        {/* INFO FACE - rotateY 180 */}
        <div
          className="absolute inset-0 w-full"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            willChange: 'transform',
            pointerEvents: currentFace === 'info' && !isFlipping ? 'auto' : 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            visibility: currentFace === 'info' ? 'visible' : 'hidden',
            zIndex: currentFace === 'info' ? 15 : 5
          }}
        >
          {faceInfo}
        </div>

        {/* PAYMENT FACE - rotateY 360deg */}
        <div
          className="absolute inset-0 w-full"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(360deg)',
            willChange: 'transform',
            opacity: currentFace === 'payment' ? 1 : 0,
            pointerEvents: currentFace === 'payment' && !isFlipping ? 'auto' : 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            visibility: currentFace === 'payment' ? 'visible' : 'hidden',
            zIndex: currentFace === 'payment' ? 10 : -1
          }}
        >
          {facePayment}
        </div>

        {/* APPOINTMENT FACE - rotateY 540deg */}
        {faceAppointment && (
          <div
            className="absolute inset-0 w-full"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(540deg)',
              willChange: 'transform',
              opacity: currentFace === 'appointment' ? 1 : 0,
              pointerEvents: currentFace === 'appointment' && !isFlipping ? 'auto' : 'none',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              visibility: currentFace === 'appointment' ? 'visible' : 'hidden',
              zIndex: currentFace === 'appointment' ? 10 : -1
            }}
          >
            {faceAppointment}
          </div>
        )}

        {/* DOCTOR FACE - rotateY 540deg */}
        {faceDoctor && (
          <div
            className="absolute inset-0 w-full"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(540deg)',
              willChange: 'transform',
              opacity: currentFace === 'doctor' ? 1 : 0,
              pointerEvents: currentFace === 'doctor' && !isFlipping ? 'auto' : 'none',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              visibility: currentFace === 'doctor' ? 'visible' : 'hidden',
              zIndex: currentFace === 'doctor' ? 10 : -1
            }}
          >
            {faceDoctor}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export type { Face }
export type { Card3DProps }
