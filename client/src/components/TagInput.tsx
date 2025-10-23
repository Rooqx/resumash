import React, { useEffect, useRef, useState } from 'react'
import { useTagStore } from '../lib/stores/useInputTags'

type TagInputProps = {
  name: string
  placeholder?: string
  onChange?: (tags: Array<string>) => void
  commaSeparates?: boolean
  pasteSeparators?: RegExp
  className?: string
  tagTitle?: string
  labelFor?: string
}

export const TagInput: React.FC<TagInputProps> = ({
  name,
  placeholder = 'Add a tag...',
  onChange,
  commaSeparates = true,
  pasteSeparators = /[\n,]+/,
  className = '',
  tagTitle,
  labelFor,
}) => {
  const { fields, setInput, addTag, addTags, removeTag } = useTagStore((s) => s)

  const data = fields?.[name] ?? { tags: [], input: '', suggestions: [] }
  const { tags = [], input = '', suggestions = [] } = data

  const [focusedSuggestion, setFocusedSuggestion] = useState<number>(-1)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (onChange) onChange(tags)
  }, [tags, onChange])

  const tryAdd = (value: string) => {
    if (value.trim()) addTag(name, value.trim())
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      tryAdd(input)
    }
    if (commaSeparates && e.key === ',') {
      e.preventDefault()
      tryAdd(input)
    }
    if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(name, tags[tags.length - 1])
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedSuggestion((s) => Math.min(s + 1, suggestions.length - 1))
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedSuggestion((s) => Math.max(s - 1, 0))
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text')
    if (pasteSeparators.test(text)) {
      e.preventDefault()
      const parts = text
        .split(pasteSeparators)
        .map((p) => p.trim())
        .filter(Boolean)
      addTags(name, parts)
    }
  }

  return (
    <div
      className={`relative w-full max-w-lg flex flex-col gap-[8px] text-xs text-white urbanist ${className}`}
    >
      <label htmlFor={labelFor} className="p-1 font-[500]">
        {tagTitle}
      </label>
      <div
        className="
          flex flex-wrap items-center gap-2 rounded-[4px] text-white border border-gray-300 
          bg-transparent px-3 py-[10px] focus-within:ring-2 focus-within:ring-gray-500
        "
      >
        {tags.map((t) => (
          <div
            key={t}
            className="
              flex items-center gap-1 rounded-full bg-zinc-900 
              text-white text-xs px-3 py-2
            "
          >
            <span>{t}</span>
            <button
              type="button"
              onClick={() => removeTag(name, t)}
              className="text-white hover:text-white focus:outline-none"
            >
              ×
            </button>
          </div>
        ))}

        <input
          ref={inputRef}
          id={labelFor}
          name={name}
          value={input || ''}
          onChange={(e) => setInput(name, e.target.value || '')}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          placeholder={placeholder}
          className={`${
            !className
              ? ` text-[white] font-[500] 
            flex-1 bg-transparent outline-none border-none text-xs
            min-w-[100px] placeholder-gray-400
                     } `
              : className
          }`}
        />
      </div>

      {/* Dropdown only when focused */}
      {isFocused && suggestions.length > 0 && (
        <ul
          className="
            absolute left-0 mt-2 w-full rounded-xl border border-gray-200 
            bg-white shadow-md z-10 max-h-48 overflow-y-auto
          "
        >
          {suggestions.map((s, idx) => {
            const isActive = idx === focusedSuggestion
            return (
              <li
                key={s + idx}
                onMouseDown={(e) => {
                  e.preventDefault()
                  addTag(name, s)
                }}
                onMouseEnter={() => setFocusedSuggestion(idx)}
                className={`px-3 py-2 text-xs cursor-pointer ${
                  isActive ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                {s}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
