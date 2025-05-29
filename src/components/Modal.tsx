import React, { ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-transparent"
      onClick={onClose}
    >
      <div
        className="rounded-2xl border shadow-xl p-6 m-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-primary_light hover:font-bold"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Modal
