'use client'
import React from 'react'

interface PreviewModalProps {
  open: boolean
  original: string
  suggestion: string
  onConfirm: () => void
  onCancel: () => void
}

export default function PreviewModal({
  open,
  original,
  suggestion,
  onConfirm,
  onCancel,
}: PreviewModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">AI Edit Preview</h3>
          <button onClick={onCancel} aria-label="Close" className="text-gray-400 hover:text-gray-700">
            &times;
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-4 p-6">
          <div className="w-full md:w-1/2">
            <div className="text-xs text-gray-500 mb-1">Original</div>
            <div className="border rounded p-3 bg-gray-50 min-h-[80px] whitespace-pre-wrap">{original}</div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="text-xs text-gray-500 mb-1">AI Suggestion</div>
            <div className="border rounded p-3 bg-green-50 min-h-[80px] whitespace-pre-wrap">{suggestion}</div>
          </div>
        </div>
        <div className="flex justify-end gap-2 p-4 border-t">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}