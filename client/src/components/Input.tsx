'use client'
import { useId, useState } from 'react'
import Image from './Image'
import useInputStore from '@/lib/stores/useInputStores'

interface InputProps {
  inputTittle?: string
  inputWidth?: string
  value?: string // optional controlled value
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void // controlled change handler
  inputBG?: string
  labelFor: string
  imgSrc?: string
  type: string
  alt?: string
  placeholder?: string
  passwordVisibility?: boolean
  forgotPassword?: string
  userInputContent?: string
  className?: string
  focusBorder?: boolean
}

export default function Input({
  inputTittle,
  // inputWidth = "full",
  value,
  onChange,
  inputBG: _inputBG = '#F7F8FA',
  labelFor,
  imgSrc,
  type,
  placeholder,
  alt,
  userInputContent,
  passwordVisibility = false,
  className,
  focusBorder: _focusBorder = true,
}: InputProps) {
  // Local state for password visibility toggle
  const [seePassword, setSeePassword] = useState(false)
  const id = useId()
  // Zustand store selectors
  const { inputValue, setInputValue } = useInputStore()

  // Handle input change and update store
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(labelFor, e.target.value)
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="flex flex-col gap-[8px] w-full text-xs urbanist">
        <label htmlFor={id} className="p-1 font-[500]">
          {inputTittle}
        </label>
        <div className="relative">
          {imgSrc && alt && (
            <Image
              src={imgSrc}
              width={20}
              height={20}
              alt={alt}
              className="absolute top-[12px] left-[16px]"
            />
          )}
          <input
            id={id}
            name={labelFor}
            type={type === 'password' && seePassword ? 'text' : type}
            placeholder={placeholder}
            value={
              value !== undefined
                ? value // controlled input case
                : inputValue[labelFor] || '' // Zustand fallback
            }
            onChange={(e) => {
              if (onChange) {
                onChange(e) // controlled case
              } else {
                handleChange(e) // Zustand fallback
              }
            }}
            className={className ?? 'w-full rounded-lg border px-3 py-2.5 text-sm outline-offset-2'}
            style={{ backgroundColor: 'var(--rs-page)', color: 'var(--rs-ink)', borderColor: 'var(--rs-line)' }}
            autoComplete="off"
          />
          {passwordVisibility && (
            <button
              type="button"
              onClick={() => setSeePassword(!seePassword)}
              className="absolute top-[12px] right-[16px] cursor-pointer urbanist font-[500] text-[#4F46E5]"
            >
              {seePassword ? 'Hide' : 'Show'}
            </button>
          )}
        </div>
      </div>
      <p className="w-full text-[14px] font-[400] mt-1 text-[#2F2F30] urbanist">
        {userInputContent}
      </p>
      <div className="flex items-center justify-end w-full"></div>
    </div>
  )
}
