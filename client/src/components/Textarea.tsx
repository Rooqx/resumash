'use client'
import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import Image from './Image'
import useInputStore from '@/lib/stores/useInputStores'

interface InputProps {
  inputTittle?: string
  inputWidth?: string
  value?: string // optional controlled value
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void // controlled change handler
  inputBG?: string
  inputHeight?: string
  labelFor: string
  imgSrc?: string
  alt?: string
  placeholder?: string
  passwordVisibility?: boolean
  forgotPassword?: string
  userInputContent?: string
  className?: string
  focusBorder?: boolean
}

export default function Textarea({
  inputTittle,
  // inputWidth = "full",
  value,
  onChange,
  inputBG = '#F7F8FA',
  inputHeight,
  labelFor,
  imgSrc,
  placeholder,
  alt,
  forgotPassword,
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
          <textarea
            id={labelFor}
            name={labelFor}
            placeholder={placeholder}
            value={
              value !== undefined
                ? value // controlled input case
                : inputValue[labelFor] || '' // Zustand fallback
            }
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              if (onChange) {
                onChange(e as any) // controlled case
              } else {
                handleChange(e as any) // Zustand fallback
              }
            }}
            className={`${
              !className
                ? `bg-[${inputBG}] text-[#ededed] font-[500] w-full min-h-[150px] resize-none rounded-[4px] border border-[#E5E7EB] py-[10px] pr-[16px] ${
                    imgSrc ? 'pl-[44px]' : 'pl-[16px]'
                  } `
                : className
            }`}
            autoComplete="off"
            style={{
              borderColor: focusBorder ? 'indigo-700' : 'transparent',
              height: inputHeight,
            }}
          ></textarea>
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
      <p className="w-full text-xs font-[400] mt-1 text-[#2F2F30] urbanist">
        {userInputContent}
      </p>
      <div className="flex items-center justify-end w-full">
        <Link
          to={'/Resume'}
          className="mt-[10px] w-full flex justify-end items-end text-[#EF4444] cursor-pointer text-[14px] Inter"
        >
          {forgotPassword}
        </Link>
      </div>
    </div>
  )
}
