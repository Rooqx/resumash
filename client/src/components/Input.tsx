'use client'
import { useState } from 'react'
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
  inputBG = '#F7F8FA',
  labelFor,
  imgSrc,
  type,
  placeholder,
  alt,
  userInputContent,
  passwordVisibility = false,
  className,
  focusBorder = true,
}: InputProps) {
  // Local state for password visibility toggle
  const [seePassword, setSeePassword] = useState(false)
  // Zustand store selectors
  const { inputValue, setInputValue } = useInputStore()

  // Handle input change and update store
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(labelFor, e.target.value)
    console.log(inputValue)
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="flex flex-col gap-[8px] w-full text-xs urbanist">
        <label htmlFor={labelFor} className="p-1 font-[500]">
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
            id={labelFor}
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
            className={`${
              !className
                ? `bg-[${inputBG}] placeholder-text-[4px] text-[#ededed] font-[500] w-full rounded-[4px] border border-[#E5E7EB] py-[10px] pr-[16px] ${
                    imgSrc ? 'pl-[44px]' : 'pl-[16px]'
                  } `
                : className
            }`}
            autoComplete="off"
            style={{
              borderColor: focusBorder ? 'indigo-700' : 'transparent',
            }}
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
