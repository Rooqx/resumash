import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { jsx, jsxs } from "react/jsx-runtime";
import { memo, useState } from "react";
import { u as useInputStore } from "./useInputStores-B01ssLVm.js";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const Image = ({
  src,
  alt,
  width,
  height,
  className = "",
  placeholder = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",
  // tiny transparent placeholder
  sizes = "(max-width: 768px) 100vw, 50vw",
  loading = false
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const handleLoad = () => setLoaded(true);
  const handleError = () => setError(true);
  return /* @__PURE__ */ jsx(
    "img",
    {
      src: error ? placeholder : src,
      alt,
      width,
      height,
      className: `${className} ${loaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`,
      loading: loading ? "lazy" : "eager",
      srcSet: `
        ${src}?w=480 480w,
        ${src}?w=768 768w,
        ${src}?w=1024 1024w
      `,
      sizes,
      onLoad: handleLoad,
      onError: handleError,
      decoding: "async",
      style: { objectFit: "cover" }
    }
  );
};
const Image$1 = memo(Image);
function Textarea({
  inputTittle,
  // inputWidth = "full",
  value,
  onChange,
  inputBG = "transparent",
  inputHeight,
  labelFor,
  imgSrc,
  placeholder,
  alt,
  userInputContent,
  passwordVisibility = false,
  className,
  focusBorder = true,
  noBorder = true,
  rounded = true
}) {
  const [seePassword, setSeePassword] = useState(false);
  const { inputValue, setInputValue } = useInputStore();
  const handleChange = (e) => {
    setInputValue(labelFor, e.target.value);
    console.log(inputValue);
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center w-full h-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-[8px] w-full text-xs urbanist", children: [
      /* @__PURE__ */ jsx("label", { htmlFor: labelFor, className: "p-1 font-[500]", children: inputTittle }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        imgSrc && alt && /* @__PURE__ */ jsx(
          Image$1,
          {
            src: imgSrc,
            width: 20,
            height: 20,
            alt,
            className: "absolute top-[12px] left-[16px]"
          }
        ),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            id: labelFor,
            name: labelFor,
            placeholder,
            value: value !== void 0 ? value : inputValue[labelFor] || "",
            onChange: (e) => {
              if (onChange) {
                onChange(e);
              } else {
                handleChange(e);
              }
            },
            className: `${!className ? `outline-none text-[#ededed] font-[500] w-full min-h-[150px] resize-none ${rounded ? "rounded-[4px]" : "rounded-2xl"} ${noBorder ? "border border-[#E5E7EB]" : ""} py-[10px] pr-[16px] ${imgSrc ? "pl-[44px]" : "pl-[16px]"} ` : className}`,
            autoComplete: "off",
            style: {
              borderColor: focusBorder ? "indigo-700" : "transparent",
              height: inputHeight,
              backgroundColor: inputBG
            }
          }
        ),
        passwordVisibility && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setSeePassword(!seePassword),
            className: "absolute top-[12px] right-[16px] cursor-pointer urbanist font-[500] text-[#4F46E5]",
            children: seePassword ? "Hide" : "Show"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "w-full text-xs font-[400] mt-1 text-[#2F2F30] urbanist", children: userInputContent }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-end w-full" })
  ] });
}
export {
  Image$1 as I,
  Textarea as T,
  cn as c
};
