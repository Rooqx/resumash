import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { I as Image, T as Textarea, c as cn } from "./Textarea-BUz8-BoU.js";
import { u as useInputStore } from "./useInputStores-B01ssLVm.js";
import { Plus, Trash } from "lucide-react";
import { u as useTagStore, a as useFieldStores, R as ResumePDF } from "./PDFTemplate-3h4ucpHh.js";
import { Drawer as Drawer$1 } from "vaul";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import axios from "axios";
import { toast } from "sonner";
import { u as useCurrentPage, A as App, S as SEO } from "./SEO-ru4NyDif.js";
import "../main.mjs";
import "clsx";
import "tailwind-merge";
import "zustand";
import "@tanstack/react-query-devtools";
import "next-themes";
import "@tanstack/react-router";
import "react-helmet-async";
import "react-dom/client";
import "@tanstack/react-router-devtools";
import "@tanstack/react-devtools";
function Input({
  inputTittle,
  // inputWidth = "full",
  value,
  onChange,
  inputBG = "#F7F8FA",
  labelFor,
  imgSrc,
  type,
  placeholder,
  alt,
  userInputContent,
  passwordVisibility = false,
  className,
  focusBorder = true
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
          Image,
          {
            src: imgSrc,
            width: 20,
            height: 20,
            alt,
            className: "absolute top-[12px] left-[16px]"
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: labelFor,
            name: labelFor,
            type: type === "password" && seePassword ? "text" : type,
            placeholder,
            value: value !== void 0 ? value : inputValue[labelFor] || "",
            onChange: (e) => {
              if (onChange) {
                onChange(e);
              } else {
                handleChange(e);
              }
            },
            className: `${!className ? `bg-[${inputBG}] placeholder-text-[4px] text-[#ededed] font-[500] w-full rounded-[4px] border border-[#E5E7EB] py-[10px] pr-[16px] ${imgSrc ? "pl-[44px]" : "pl-[16px]"} ` : className}`,
            autoComplete: "off",
            style: {
              borderColor: focusBorder ? "indigo-700" : "transparent"
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
    /* @__PURE__ */ jsx("p", { className: "w-full text-[14px] font-[400] mt-1 text-[#2F2F30] urbanist", children: userInputContent }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-end w-full" })
  ] });
}
function BasicInfoAndSummary() {
  const { inputValue, setInputValue } = useInputStore();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-4 mt-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold", children: " Basic Info" }),
      /* @__PURE__ */ jsxs("div", { className: "border p-4 rounded-md space-y-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "text",
              labelFor: "fullName",
              value: inputValue.fullName,
              onChange: (e) => setInputValue(e.target.name, e.target.value),
              inputTittle: "Full Name",
              placeholder: "Enter your full name"
            }
          ),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "text",
              labelFor: "label",
              value: inputValue.label,
              onChange: (e) => setInputValue(e.target.name, e.target.value),
              inputTittle: "Job Title",
              placeholder: "Enter your profession"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "email",
              labelFor: "email",
              value: inputValue.email,
              onChange: (e) => setInputValue(e.target.name, e.target.value),
              inputTittle: "Email",
              placeholder: "Enter your email"
            }
          ),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "tel",
              labelFor: "phone",
              value: inputValue.phone,
              onChange: (e) => setInputValue(e.target.name, e.target.value),
              inputTittle: "Phone Number",
              placeholder: "Enter your phone number"
            }
          ),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "text",
              labelFor: "city",
              value: inputValue.city,
              onChange: (e) => setInputValue(e.target.name, e.target.value),
              inputTittle: "City",
              placeholder: "Enter your city"
            }
          ),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "text",
              labelFor: "country",
              value: inputValue.country,
              onChange: (e) => setInputValue(e.target.name, e.target.value),
              inputTittle: "Country",
              placeholder: "Enter your country"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "url",
              labelFor: "linkdlnUrl",
              value: inputValue.linkdlnUrl,
              onChange: (e) => setInputValue(e.target.name, e.target.value),
              inputTittle: "LinkedIn URL",
              placeholder: "Enter your LinkedIn profile URL"
            }
          ),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "url",
              labelFor: "githubUrl",
              value: inputValue.githubUrl,
              onChange: (e) => setInputValue(e.target.name, e.target.value),
              inputTittle: "GitHub URL",
              placeholder: "Enter your GitHub profile URL"
            }
          ),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "url",
              labelFor: "portfolioUrl",
              value: inputValue.portfolioUrl,
              onChange: (e) => setInputValue(e.target.name, e.target.value),
              inputTittle: "Portfolio URL",
              placeholder: "Enter your portfolio URL"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4 mt-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold", children: "Summary" }),
      /* @__PURE__ */ jsx("div", { className: "border p-4 rounded-md space-y-3", children: /* @__PURE__ */ jsx(
        Textarea,
        {
          labelFor: "summary",
          value: inputValue.summary,
          onChange: (e) => setInputValue(e.target.name, e.target.value),
          inputTittle: "Professional Summary",
          placeholder: "Enter your professional summary or career objective"
        }
      ) })
    ] })
  ] });
}
const TagInput = ({
  name,
  placeholder = "Add a tag...",
  onChange,
  commaSeparates = true,
  pasteSeparators = /[\n,]+/,
  className = "",
  tagTitle,
  labelFor
}) => {
  const { fields, setInput, addTag, addTags, removeTag } = useTagStore((s) => s);
  const data = (fields == null ? void 0 : fields[name]) ?? { tags: [], input: "", suggestions: [] };
  const { tags = [], input = "", suggestions = [] } = data;
  const [focusedSuggestion, setFocusedSuggestion] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => {
    if (onChange) onChange(tags);
  }, [tags, onChange]);
  const tryAdd = (value) => {
    if (value.trim()) addTag(name, value.trim());
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      tryAdd(input);
    }
    if (commaSeparates && e.key === ",") {
      e.preventDefault();
      tryAdd(input);
    }
    if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(name, tags[tags.length - 1]);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedSuggestion((s) => Math.min(s + 1, suggestions.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedSuggestion((s) => Math.max(s - 1, 0));
    }
  };
  const handlePaste = (e) => {
    const text = e.clipboardData.getData("text");
    if (pasteSeparators.test(text)) {
      e.preventDefault();
      const parts = text.split(pasteSeparators).map((p) => p.trim()).filter(Boolean);
      addTags(name, parts);
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `relative w-full max-w-lg flex flex-col gap-[8px] text-xs text-white urbanist ${className}`,
      children: [
        /* @__PURE__ */ jsx("label", { htmlFor: labelFor, className: "p-1 font-[500]", children: tagTitle }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "\n          flex flex-wrap items-center gap-2 rounded-[4px] text-white border border-gray-300 \n          bg-transparent px-3 py-[10px] focus-within:ring-2 focus-within:ring-gray-500\n        ",
            children: [
              tags.map((t) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "\n              flex items-center gap-1 rounded-full bg-zinc-900 \n              text-white text-xs px-3 py-2\n            ",
                  children: [
                    /* @__PURE__ */ jsx("span", { children: t }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => removeTag(name, t),
                        className: "text-white hover:text-white focus:outline-none",
                        children: "×"
                      }
                    )
                  ]
                },
                t
              )),
              /* @__PURE__ */ jsx(
                "input",
                {
                  ref: inputRef,
                  id: labelFor,
                  name,
                  value: input || "",
                  onChange: (e) => setInput(name, e.target.value || ""),
                  onKeyDown: handleKeyDown,
                  onPaste: handlePaste,
                  onFocus: () => setIsFocused(true),
                  onBlur: () => setTimeout(() => setIsFocused(false), 150),
                  placeholder,
                  className: `${!className ? ` text-[white] font-[500] 
            flex-1 bg-transparent outline-none border-none text-xs
            min-w-[100px] placeholder-gray-400
                     } ` : className}`
                }
              )
            ]
          }
        ),
        isFocused && suggestions.length > 0 && /* @__PURE__ */ jsx(
          "ul",
          {
            className: "\n            absolute left-0 mt-2 w-full rounded-xl border border-gray-200 \n            bg-white shadow-md z-10 max-h-48 overflow-y-auto\n          ",
            children: suggestions.map((s, idx) => {
              const isActive = idx === focusedSuggestion;
              return /* @__PURE__ */ jsx(
                "li",
                {
                  onMouseDown: (e) => {
                    e.preventDefault();
                    addTag(name, s);
                  },
                  onMouseEnter: () => setFocusedSuggestion(idx),
                  className: `px-3 py-2 text-xs cursor-pointer ${isActive ? "bg-gray-100" : "hover:bg-gray-50"}`,
                  children: s
                },
                s + idx
              );
            })
          }
        )
      ]
    }
  );
};
function Skills() {
  var _a, _b;
  const { fields, addField, updateField, deleteField } = useFieldStores();
  const { removeField } = useTagStore();
  const isEmpty = ((_a = fields["skills"]) == null ? void 0 : _a.length) === 0;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4 mt-6", children: [
    /* @__PURE__ */ jsxs("span", { className: "w-full flex justify-between items-start", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold", children: "Skills" }),
      isEmpty && /* @__PURE__ */ jsx(
        "button",
        {
          className: `py-2  px-4 relative overflow-hidden bg-[transparent] rounded-xs justify-center cursor-pointer
             text-white text-xs font-normal flex gap-2 items-center mb-3 before:content-[''] 
             before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-white before:transition-all
              before:duration-300 hover:before:w-full hover:text-black border border-white`,
          onClick: () => {
            addField("skills", 0);
          },
          children: /* @__PURE__ */ jsxs("span", { className: "flex gap-2 items-center z-10", children: [
            /* @__PURE__ */ jsx(Plus, { size: 12 }),
            "Add skill"
          ] })
        }
      )
    ] }),
    (_b = fields["skills"]) == null ? void 0 : _b.map((field, i) => /* @__PURE__ */ jsxs("div", { className: "border p-4 rounded-md", children: [
      /* @__PURE__ */ jsx(
        Input,
        {
          type: "text",
          labelFor: "skillName",
          value: field.skillName,
          onChange: (e) => updateField("skills", i, e.target.name, e.target.value),
          inputTittle: "Skill Category",
          placeholder: "e.g., Frontend Development, Cybersecurity, DevOps"
        }
      ),
      /* @__PURE__ */ jsx(
        TagInput,
        {
          name: `skills-${i}`,
          onChange: (t) => t
        },
        field.i
      ),
      " ",
      /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-3", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            className: "py-2 mt-5 px-4 relative overflow-hidden bg-[transparent] rounded-md justify-center w-full cursor-pointer text-white text-base font-medium flex gap-2 items-center mb-3 before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-white before:transition-all before:duration-300 hover:before:w-full hover:text-black border border-white",
            onClick: () => {
              deleteField("skills", i);
              removeField(`skills-${i}`);
            },
            children: [
              /* @__PURE__ */ jsx(Trash, { className: "hover:text-black z-1", size: 16 }),
              /* @__PURE__ */ jsx("p", { className: "z-2 hover:text-black ", children: " Delete Skill" })
            ]
          }
        ),
        " ",
        /* @__PURE__ */ jsxs(
          "button",
          {
            className: "py-2 px-4 bg-[white] justify-center w-full  rounded-md cursor-pointer text-black text-base font-medium flex gap-2 items-center",
            onClick: () => addField("skills", i),
            children: [
              /* @__PURE__ */ jsx(Plus, { size: 16 }),
              " Add new skill"
            ]
          }
        )
      ] })
    ] }, i))
  ] });
}
function Experience() {
  var _a, _b;
  const { fields, addField, updateField, deleteField } = useFieldStores();
  const { removeField } = useTagStore();
  const isEmpty = ((_a = fields["experience"]) == null ? void 0 : _a.length) === 0;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4 mt-6", children: [
    /* @__PURE__ */ jsxs("span", { className: "w-full flex justify-between items-start", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold", children: "Experiences" }),
      isEmpty && /* @__PURE__ */ jsx(
        "button",
        {
          className: `py-2  px-4 relative overflow-hidden bg-[transparent] rounded-xs justify-center cursor-pointer
             text-white text-xs font-normal flex gap-2 items-center mb-3 before:content-[''] 
             before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-white before:transition-all
              before:duration-300 hover:before:w-full hover:text-black border border-white`,
          onClick: () => {
            addField("experience", 0);
          },
          children: /* @__PURE__ */ jsxs("span", { className: "flex gap-2 items-center z-10", children: [
            /* @__PURE__ */ jsx(Plus, { size: 12 }),
            "Add Experience"
          ] })
        }
      )
    ] }),
    (_b = fields["experience"]) == null ? void 0 : _b.map((field, i) => /* @__PURE__ */ jsxs("div", { className: "border p-4 rounded-md", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "text",
            labelFor: "companyName",
            value: field == null ? void 0 : field.companyName,
            onChange: (e) => updateField("experience", i, e.target.name, e.target.value),
            inputTittle: "Company Name",
            placeholder: "Enter company name"
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "text",
            labelFor: "jobPosition",
            value: field == null ? void 0 : field.jobPosition,
            onChange: (e) => updateField("experience", i, e.target.name, e.target.value),
            inputTittle: "Job Position",
            placeholder: "Enter your job title"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "text",
            labelFor: "jobStartDate",
            value: field == null ? void 0 : field.jobStartDate,
            onChange: (e) => updateField("experience", i, e.target.name, e.target.value),
            inputTittle: "Start Date",
            placeholder: "MM YYYY(March 2025)"
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "text",
            labelFor: "jobEndDate",
            value: field == null ? void 0 : field.jobEndDate,
            onChange: (e) => updateField("experience", i, e.target.name, e.target.value),
            inputTittle: "End Date",
            placeholder: "MM YYYY(March 2025) or Present"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        Textarea,
        {
          labelFor: "jobSummary",
          value: field == null ? void 0 : field.jobSummary,
          onChange: (e) => updateField("experience", i, e.target.name, e.target.value),
          inputTittle: "Job Description",
          placeholder: "Describe your responsibilities and achievements"
        }
      ),
      /* @__PURE__ */ jsx(
        TagInput,
        {
          name: `jobHighlights-${i}`,
          tagTitle: "Key Achievements",
          placeholder: "List key achievements"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-3", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            className: `py-2 mt-5 px-4 relative overflow-hidden bg-[transparent] rounded-md justify-center w-full cursor-pointer text-white text-base font-medium flex gap-2 items-center mb-3 before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-white before:transition-all before:duration-300 hover:before:w-full hover:text-black border border-white`,
            onClick: () => {
              deleteField("experience", i);
              removeField(`jobHighlights-${i}`);
            },
            children: [
              /* @__PURE__ */ jsx(Trash, { className: "hover:text-black z-1", size: 16 }),
              /* @__PURE__ */ jsx("p", { className: "z-2 hover:text-black ", children: " Delete Experience" })
            ]
          }
        ),
        " ",
        /* @__PURE__ */ jsxs(
          "button",
          {
            className: "py-2 px-4 bg-[white] justify-center w-full  rounded-md cursor-pointer text-black text-base font-medium flex gap-2 items-center",
            onClick: () => addField("experience", i),
            children: [
              /* @__PURE__ */ jsx(Plus, { size: 16 }),
              " Add New Experience"
            ]
          }
        )
      ] })
    ] }, i))
  ] });
}
function Education() {
  var _a, _b;
  const { fields, addField, updateField, deleteField } = useFieldStores();
  const isEmpty = ((_a = fields["education"]) == null ? void 0 : _a.length) === 0;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4 mt-6", children: [
    /* @__PURE__ */ jsxs("span", { className: "w-full flex justify-between items-start", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold", children: "Educations" }),
      isEmpty && /* @__PURE__ */ jsx(
        "button",
        {
          className: `py-2  px-4 relative overflow-hidden bg-[transparent] rounded-xs justify-center cursor-pointer
             text-white text-xs font-normal flex gap-2 items-center mb-3 before:content-[''] 
             before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-white before:transition-all
              before:duration-300 hover:before:w-full hover:text-black border border-white`,
          onClick: () => {
            addField("education", 0);
          },
          children: /* @__PURE__ */ jsxs("span", { className: "flex gap-2 items-center z-10", children: [
            /* @__PURE__ */ jsx(Plus, { size: 12 }),
            "Add Education"
          ] })
        }
      )
    ] }),
    (_b = fields["education"]) == null ? void 0 : _b.map((field, i) => /* @__PURE__ */ jsxs("div", { className: "border p-4 rounded-md", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "text",
            labelFor: "institution",
            value: field.institution,
            onChange: (e) => updateField("education", i, e.target.name, e.target.value),
            inputTittle: "Institution Name",
            placeholder: "Enter school or university name"
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "text",
            labelFor: "studyType",
            value: field.studyType,
            onChange: (e) => updateField("education", i, e.target.name, e.target.value),
            inputTittle: "Degree Type",
            placeholder: "e.g., Bachelor's, Master's, PhD"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "text",
            labelFor: "area",
            value: field.area,
            onChange: (e) => updateField("education", i, e.target.name, e.target.value),
            inputTittle: "Field of Study",
            placeholder: "e.g., Computer Science, Business Administration"
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "text",
            labelFor: "gpa",
            value: field.gpa,
            onChange: (e) => updateField("education", i, e.target.name, e.target.value),
            inputTittle: "GPA",
            placeholder: "e.g., 3.8/4.0"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "text",
            labelFor: "startDate",
            value: field.startDate,
            onChange: (e) => updateField("education", i, e.target.name, e.target.value),
            inputTittle: "Start Date",
            placeholder: "MM/YYYY"
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "text",
            labelFor: "endDate",
            value: field.endDate,
            onChange: (e) => updateField("education", i, e.target.name, e.target.value),
            inputTittle: "End Date",
            placeholder: "MM/YYYY or Present"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-3", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            className: "py-2 mt-5 px-4 relative overflow-hidden bg-[transparent] rounded-md justify-center w-full cursor-pointer text-white text-base font-medium flex gap-2 items-center mb-3 before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-white before:transition-all before:duration-300 hover:before:w-full hover:text-black border border-white",
            onClick: () => {
              deleteField("education", i);
            },
            children: [
              /* @__PURE__ */ jsx(Trash, { className: "hover:text-black z-1", size: 16 }),
              /* @__PURE__ */ jsx("p", { className: "z-2 hover:text-black ", children: " Delete Education" })
            ]
          }
        ),
        " ",
        /* @__PURE__ */ jsxs(
          "button",
          {
            className: "py-2 px-4 bg-[white] justify-center w-full  rounded-md cursor-pointer text-black text-base font-medium flex gap-2 items-center",
            onClick: () => addField("education", i),
            children: [
              /* @__PURE__ */ jsx(Plus, { size: 16 }),
              " Add New Education"
            ]
          }
        )
      ] })
    ] }, i))
  ] });
}
function Project() {
  var _a, _b;
  const { fields, addField, updateField, deleteField } = useFieldStores();
  const isEmpty = ((_a = fields["projects"]) == null ? void 0 : _a.length) === 0;
  const { removeField } = useTagStore();
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4 mt-6", children: [
    /* @__PURE__ */ jsxs("span", { className: "w-full flex justify-between items-start", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold", children: "Projects" }),
      isEmpty && /* @__PURE__ */ jsx(
        "button",
        {
          className: `py-2  px-4 relative overflow-hidden bg-[transparent] rounded-xs justify-center cursor-pointer
             text-white text-xs font-normal flex gap-2 items-center mb-3 before:content-[''] 
             before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-white before:transition-all
              before:duration-300 hover:before:w-full hover:text-black border border-white`,
          onClick: () => {
            addField("projects", 0);
          },
          children: /* @__PURE__ */ jsxs("span", { className: "flex gap-2 items-center z-10", children: [
            /* @__PURE__ */ jsx(Plus, { size: 12 }),
            "Add project"
          ] })
        }
      )
    ] }),
    (_b = fields["projects"]) == null ? void 0 : _b.map((field, i) => /* @__PURE__ */ jsxs("div", { className: "border p-4 rounded-md", children: [
      /* @__PURE__ */ jsx(
        Input,
        {
          type: "text",
          labelFor: "name",
          value: field.name,
          onChange: (e) => updateField("projects", i, e.target.name, e.target.value),
          inputTittle: "Project Name",
          placeholder: "Enter project name"
        }
      ),
      /* @__PURE__ */ jsx(
        Input,
        {
          type: "textarea",
          labelFor: "description",
          value: field.description,
          onChange: (e) => updateField("projects", i, e.target.name, e.target.value),
          inputTittle: "Project Description",
          placeholder: "Describe the project, your role, and key features"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "url",
            labelFor: "url",
            value: field.url,
            onChange: (e) => updateField("projects", i, e.target.name, e.target.value),
            inputTittle: "Project URL",
            placeholder: "Enter live demo or repository URL"
          }
        ),
        /* @__PURE__ */ jsx(
          TagInput,
          {
            tagTitle: "Technologies Used",
            labelFor: "projectTechnologies",
            name: `projectTechnologies-${i}`,
            placeholder: "List technologies used in your project",
            onChange: (t) => t
          },
          field.i
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-3", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            className: "py-2 mt-5 px-4 relative overflow-hidden bg-[transparent] rounded-md justify-center w-full cursor-pointer text-white text-base font-medium flex gap-2 items-center mb-3 before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-white before:transition-all before:duration-300 hover:before:w-full hover:text-black border border-white",
            onClick: () => {
              deleteField("projects", i);
              removeField(`projectTechnologies-${i}`);
            },
            children: [
              /* @__PURE__ */ jsx(Trash, { className: "hover:text-black z-1", size: 16 }),
              /* @__PURE__ */ jsx("p", { className: "z-2 hover:text-black ", children: " Delete Project" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            className: "py-2 px-4 bg-[white] justify-center w-full  rounded-md cursor-pointer text-black text-base font-medium flex gap-2 items-center",
            onClick: () => addField("projects", i),
            children: [
              /* @__PURE__ */ jsx(Plus, { size: 16 }),
              " Add new project"
            ]
          }
        )
      ] })
    ] }, i))
  ] });
}
function Certificate() {
  var _a;
  const { fields, addField, updateField, deleteField } = useFieldStores();
  const isEmpty = ((_a = fields["certificates"]) == null ? void 0 : _a.length) > 0;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4 mt-6", children: [
    /* @__PURE__ */ jsxs("span", { className: "w-full flex justify-between items-start", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold", children: "Certifications" }),
      !isEmpty && /* @__PURE__ */ jsx(
        "button",
        {
          className: `py-2  px-4 relative overflow-hidden bg-[transparent] rounded-xs justify-center cursor-pointer
             text-white text-xs font-normal flex gap-2 items-center mb-3 before:content-[''] 
             before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-white before:transition-all
              before:duration-300 hover:before:w-full hover:text-black border border-white`,
          onClick: () => {
            addField("certificates", 0);
          },
          children: /* @__PURE__ */ jsxs("span", { className: "flex gap-2 items-center z-10", children: [
            /* @__PURE__ */ jsx(Plus, { size: 12 }),
            "Add Certificate"
          ] })
        }
      )
    ] }),
    isEmpty && fields["certificates"].map((field, i) => /* @__PURE__ */ jsxs("div", { className: "border p-4 rounded-md", children: [
      /* @__PURE__ */ jsx(
        Input,
        {
          type: "text",
          labelFor: "certificateName",
          value: field.certificateName,
          onChange: (e) => updateField("certificates", i, e.target.name, e.target.value),
          inputTittle: "Certificate Name",
          placeholder: "Enter certification name"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "text",
            labelFor: "certificateIssuer",
            value: field.certificateIssuer,
            onChange: (e) => updateField("certificates", i, e.target.name, e.target.value),
            inputTittle: "Issuing Organization",
            placeholder: "e.g., Google, Microsoft, AWS"
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "text",
            labelFor: "certificateDate",
            value: field.certificateDate,
            onChange: (e) => updateField("certificates", i, e.target.name, e.target.value),
            inputTittle: "Issue Date",
            placeholder: "MM/YYYY"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        Input,
        {
          type: "url",
          labelFor: "certificateUrl",
          value: field.certificateUrl,
          onChange: (e) => updateField("certificates", i, e.target.name, e.target.value),
          inputTittle: "Certificate URL",
          placeholder: "Enter verification URL"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-3", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            className: "py-2 mt-5 px-4 relative overflow-hidden bg-[transparent] rounded-md justify-center w-full cursor-pointer text-white text-base font-medium flex gap-2 items-center mb-3 before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-white before:transition-all before:duration-300 hover:before:w-full hover:text-black border border-white",
            onClick: () => {
              deleteField("certificates", i);
            },
            children: [
              /* @__PURE__ */ jsx(Trash, { className: "hover:text-black z-1", size: 16 }),
              /* @__PURE__ */ jsx("p", { className: "z-2 hover:text-black ", children: " Delete Certificate" })
            ]
          }
        ),
        " ",
        /* @__PURE__ */ jsxs(
          "button",
          {
            className: "py-2 px-4 bg-[white] justify-center w-full  rounded-md cursor-pointer text-black text-base font-medium flex gap-2 items-center",
            onClick: () => addField("certificates", i),
            children: [
              /* @__PURE__ */ jsx(Plus, { size: 16 }),
              " Add new certificate"
            ]
          }
        )
      ] })
    ] }, i))
  ] });
}
function Award() {
  var _a;
  const { fields, addField, updateField, deleteField } = useFieldStores();
  const isEmpty = ((_a = fields["awards"]) == null ? void 0 : _a.length) === 0;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4 mt-6", children: [
    /* @__PURE__ */ jsxs("span", { className: "w-full flex justify-between items-start", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold", children: "Awards" }),
      isEmpty && /* @__PURE__ */ jsx(
        "button",
        {
          className: `py-2  px-4 relative overflow-hidden bg-[transparent] rounded-xs justify-center cursor-pointer
             text-white text-xs font-normal flex gap-2 items-center mb-3 before:content-[''] 
             before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-white before:transition-all
              before:duration-300 hover:before:w-full hover:text-black border border-white`,
          onClick: () => {
            addField("awards", 0);
          },
          children: /* @__PURE__ */ jsxs("span", { className: "flex gap-2 items-center z-10", children: [
            /* @__PURE__ */ jsx(Plus, { size: 12 }),
            "Add Award"
          ] })
        }
      )
    ] }),
    fields["awards"].map((field, i) => /* @__PURE__ */ jsxs("div", { className: "border p-4 rounded-md", children: [
      /* @__PURE__ */ jsx(
        Input,
        {
          type: "text",
          labelFor: "awardTitle",
          value: field.awardTitle,
          onChange: (e) => updateField("awards", i, e.target.name, e.target.value),
          inputTittle: "Award Title",
          placeholder: "Enter award name"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "text",
            labelFor: "awarder",
            value: field.awarder,
            onChange: (e) => updateField("awards", i, e.target.name, e.target.value),
            inputTittle: "Awarding Organization",
            placeholder: "Organization that gave the award"
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "text",
            labelFor: "awardDate",
            value: field.awardDate,
            onChange: (e) => updateField("awards", i, e.target.name, e.target.value),
            inputTittle: "Award Date",
            placeholder: "MM/YYYY"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        Input,
        {
          type: "textarea",
          labelFor: "awardSummary",
          value: field.awardSummary,
          onChange: (e) => updateField("awards", i, e.target.name, e.target.value),
          inputTittle: "Award Description",
          placeholder: "Describe the award and significance"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-3", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            className: "py-2 mt-5 px-4 relative overflow-hidden bg-[transparent] rounded-md justify-center w-full cursor-pointer text-white text-base font-medium flex gap-2 items-center mb-3 before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-white before:transition-all before:duration-300 hover:before:w-full hover:text-black border border-white",
            onClick: () => {
              deleteField("awards", i);
            },
            children: [
              /* @__PURE__ */ jsx(Trash, { className: "hover:text-black z-1", size: 16 }),
              /* @__PURE__ */ jsx("p", { className: "z-2 hover:text-black ", children: " Delete Award" })
            ]
          }
        ),
        " ",
        /* @__PURE__ */ jsxs(
          "button",
          {
            className: "py-2 px-4 bg-[white] justify-center w-full  rounded-md cursor-pointer text-black text-base font-medium flex gap-2 items-center",
            onClick: () => addField("awards", i),
            children: [
              /* @__PURE__ */ jsx(Plus, { size: 16 }),
              " Add new award"
            ]
          }
        )
      ] })
    ] }, i))
  ] });
}
function Drawer({
  ...props
}) {
  return /* @__PURE__ */ jsx(Drawer$1.Root, { "data-slot": "drawer", ...props });
}
function DrawerTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(Drawer$1.Trigger, { "data-slot": "drawer-trigger", ...props });
}
function DrawerPortal({
  ...props
}) {
  return /* @__PURE__ */ jsx(Drawer$1.Portal, { "data-slot": "drawer-portal", ...props });
}
function DrawerClose({
  ...props
}) {
  return /* @__PURE__ */ jsx(Drawer$1.Close, { "data-slot": "drawer-close", ...props });
}
function DrawerOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Drawer$1.Overlay,
    {
      "data-slot": "drawer-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function DrawerContent({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(DrawerPortal, { "data-slot": "drawer-portal", children: [
    /* @__PURE__ */ jsx(DrawerOverlay, {}),
    /* @__PURE__ */ jsxs(
      Drawer$1.Content,
      {
        "aria-label": "drawer-content",
        "aria-describedby": "drawer-content",
        "data-slot": "drawer-content",
        className: cn(
          "group/drawer-content bg-background fixed z-50 flex h-auto flex-col",
          "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b",
          "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t",
          "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm",
          "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm",
          className
        ),
        ...props,
        children: [
          /* @__PURE__ */ jsx("div", { className: "bg-muted mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block" }),
          children
        ]
      }
    )
  ] });
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
function getDeviceFromWidth(width) {
  if (width < 640) {
    return {
      device: "mobile",
      isMobile: true,
      isTablet: false,
      isDesktop: false
    };
  }
  if (width < 1024) {
    return {
      device: "tablet",
      isMobile: false,
      isTablet: true,
      isDesktop: false
    };
  }
  return {
    device: "desktop",
    isMobile: false,
    isTablet: false,
    isDesktop: true
  };
}
function useDeviceType() {
  const [deviceInfo, setDeviceInfo] = useState(
    () => typeof window === "undefined" ? { device: "desktop", isMobile: false, isTablet: false, isDesktop: true } : getDeviceFromWidth(window.innerWidth)
  );
  const [mounted, setMounted] = useState(false);
  const currentDevice = useRef(deviceInfo.device);
  const rafRef = useRef(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    setMounted(true);
    const next = getDeviceFromWidth(window.innerWidth);
    currentDevice.current = next.device;
    setDeviceInfo(next);
    const onResize = () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const next2 = getDeviceFromWidth(window.innerWidth);
        if (next2.device !== currentDevice.current) {
          currentDevice.current = next2.device;
          setDeviceInfo(next2);
        }
      });
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);
  if (!mounted) {
    return {
      device: "desktop",
      isMobile: false,
      isTablet: false,
      isDesktop: true
    };
  }
  return deviceInfo;
}
async function downloadResume(fileName, setIsDownloading) {
  setIsDownloading(true);
  const { inputValue } = useInputStore.getState();
  const { fields } = useFieldStores.getState();
  const tagFields = useTagStore.getState().fields;
  const payload = { inputValue, fields, tagFields };
  try {
    const res = await axios.post(
      "http://localhost:5000/api/v1/resumes/download-resume",
      payload,
      { responseType: "blob" }
      // IMPORTANT
    );
    console.log("fetch:", res);
    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    setIsDownloading(false);
    toast.success("Resume Downloaded");
  } catch (error) {
    console.log("error:", error);
    toast.error("Resume download failed");
    setIsDownloading(false);
  }
}
function Sidebar() {
  const [open, setOpen] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const { inputValue } = useInputStore();
  const { isDesktop } = useDeviceType();
  const [displayPdf, setDisplayPdf] = useState(false);
  const fileName = (inputValue == null ? void 0 : inputValue.fullName) ? `${inputValue.fullName.split(" ").join("_")}_resume.pdf` : "resume.pdf";
  console.log(isDownloading);
  const sidebarContent = /* @__PURE__ */ jsxs("div", { className: "shadow-[2px_5px_10px_rgba(197,197,197,0.3)] w-[100vw] flex-shrink-0 md:w-[450px] lg:w-[370px] bg-black text-white rounded-[1px] py-2 pb-6 px-4 max-h-[850px] overflow-y-auto mr-10 scroll-bar", children: [
    !isDesktop && /* @__PURE__ */ jsxs("div", { className: "sticky top-0 bg-black z-10 py-3", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "py-2 px-4 relative overflow-hidden bg-[transparent] rounded-md justify-center w-full cursor-pointer text-white text-base font-medium flex gap-2 items-center mb-3  \n                    before:content-['']  before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-white before:transition-all before:duration-300\n                    hover:before:w-full hover:text-black border border-white",
          onClick: () => setDisplayPdf(!displayPdf),
          children: /* @__PURE__ */ jsx("p", { className: "z-2 hover:text-black ", children: " Preview resume" })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "py-2 px-4 bg-[white] justify-center w-full  rounded-md cursor-pointer text-black text-base font-medium flex gap-2 items-center",
          onClick: () => downloadResume(fileName, setIsDownloading),
          children: isDownloading ? "Downloading..." : "Download resume"
        }
      )
    ] }),
    /* @__PURE__ */ jsx(BasicInfoAndSummary, {}),
    /* @__PURE__ */ jsx(Skills, {}),
    /* @__PURE__ */ jsx(Experience, {}),
    /* @__PURE__ */ jsx(Education, {}),
    /* @__PURE__ */ jsx(Project, {}),
    /* @__PURE__ */ jsx(Certificate, {}),
    /* @__PURE__ */ jsx(Award, {})
  ] });
  if (!isDesktop) {
    return /* @__PURE__ */ jsxs(Drawer, { open, onOpenChange: setOpen, direction: "left", children: [
      /* @__PURE__ */ jsx(DrawerTrigger, { className: "relative", asChild: true, children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            className: "absolute top-2.5 text-black bg-zinc-100 left-4 z-50 lg:hidden",
            children: "Write on Resume"
          }
        ),
        /* @__PURE__ */ jsx(Button, { className: "absolute top-2.5 text-white left-50 z-50 lg:hidden", children: "Change Template" })
      ] }) }),
      /* @__PURE__ */ jsxs(DrawerContent, { className: "p-0", children: [
        /* @__PURE__ */ jsx(DrawerClose, { asChild: true, children: /* @__PURE__ */ jsx(
          Button,
          {
            className: "py-2 px-4 fixed overflow-hidden bg-[transparent] rounded-md justify-center w-[400px] cursor-pointer text-white text-base font-medium flex gap-2 items-center mb-3  \n                    before:content-['']  before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-white before:transition-all before:duration-300\n                    hover:before:w-full hover:text-black top-6 left-4 z-50 ",
            onClick: () => setDisplayPdf(!displayPdf)
          }
        ) }),
        sidebarContent
      ] })
    ] });
  }
  return sidebarContent;
}
function RouteComponent() {
  const {
    inputValue,
    setInputData
  } = useInputStore();
  const {
    setFields
  } = useFieldStores();
  const {
    setTags
  } = useTagStore();
  const queryClient = useQueryClient();
  const {
    isMobile,
    isDesktop
  } = useDeviceType();
  const {
    page,
    setPage
  } = useCurrentPage();
  const [isDownloading, setIsDownloading] = useState(false);
  const resumeData = queryClient.getQueryData(["tailoredResume"]);
  useEffect(() => {
    if (resumeData) {
      setInputData(resumeData.inputValue);
      setFields(resumeData.fields);
      setTags(resumeData.tagFields);
    }
  }, [resumeData]);
  useEffect(() => {
    setPage("buildPage");
  }, [page, setPage]);
  const fileName = (inputValue == null ? void 0 : inputValue.fullName) ? `${inputValue.fullName.split(" ").join("_")}_resume.pdf` : "resume.pdf";
  return /* @__PURE__ */ jsxs(App, { children: [
    /* @__PURE__ */ jsx(SEO, { title: "Build Resume", description: "Build your professional resume easily." }),
    /* @__PURE__ */ jsx("div", { className: `  space-y-4 bg-black text-white relative h-auto`, children: /* @__PURE__ */ jsxs("div", { className: "w-full flex items-start gap-0 justify-center h-full", children: [
      /* @__PURE__ */ jsx(Sidebar, {}),
      /* @__PURE__ */ jsx("div", { className: "w-full lg:w-[70%] flex justify-center items-center lg:items-start h-[600px] lg:h-[850px] overflow-auto scroll-bar mt-15 lg:mt-0 ", children: /* @__PURE__ */ jsx("div", { className: "", children: isMobile ? /* @__PURE__ */ jsx("div", { className: "mt-20 cursor-grab scale-50", children: /* @__PURE__ */ jsx(ResumePDF, {}) }) : /* @__PURE__ */ jsx(TransformWrapper, { initialScale: isDesktop ? 0.8 : 0.5, minScale: 0.3, maxScale: 0.9, centerOnInit: false, pinch: {
        disabled: false
      }, wheel: {
        step: 0.1
      }, children: /* @__PURE__ */ jsx(TransformComponent, { children: /* @__PURE__ */ jsx("div", { className: "-mt-20 cursor-grab", children: /* @__PURE__ */ jsx(ResumePDF, {}) }) }) }) }) }),
      isDesktop && /* @__PURE__ */ jsxs("div", { className: "h-auto space-y-5 p-5 w-[20%]", children: [
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("button", { className: `py-2 px-4 relative overflow-hidden bg-[transparent] rounded-md justify-center w-full cursor-pointer text-white text-base font-medium flex gap-2 items-center mb-3  
              before:content-['']  before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-white before:transition-all before:duration-300
              hover:before:w-full hover:text-black border border-white ${isDownloading ? "bg-[#ffffff96] cursor-not-allowed" : ""}`, onClick: () => downloadResume(fileName, setIsDownloading), disabled: isDownloading, children: isDownloading ? /* @__PURE__ */ jsxs("div", { className: "flex gap-2 items-center justify-center w-full z-2 hover:text-black text-[14px]", children: [
          /* @__PURE__ */ jsx("span", { className: `inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin align-middle z-2 hover:border-black`, "aria-label": "Loading...", role: "status" }),
          " ",
          /* @__PURE__ */ jsx("p", { className: "z-2 hover:text-black ", children: "Downloading..." })
        ] }) : /* @__PURE__ */ jsxs("p", { className: "z-2 hover:text-black text-nowrap", children: [
          " ",
          "Download resume"
        ] }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "bg-[#2c5530] p-4 rounded-md mt-15", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-white text-nowrap", children: "Other Templates" }),
          /* @__PURE__ */ jsx("div", { className: "py-6", children: /* @__PURE__ */ jsx("button", { className: "text-base text-white", children: "More Templates coming soon" }) })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  RouteComponent as component
};
