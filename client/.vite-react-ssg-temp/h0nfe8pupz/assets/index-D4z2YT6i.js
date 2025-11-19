import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Upload, Send } from "lucide-react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { c as cn, T as Textarea } from "./Textarea-BUz8-BoU.js";
import axios from "axios";
import { u as useCurrentPage, A as App, S as SEO } from "./SEO-ru4NyDif.js";
import { w as wakeServer } from "./wakeServer-_xVPpTf7.js";
import "../main.mjs";
import "clsx";
import "tailwind-merge";
import "./useInputStores-B01ssLVm.js";
import "zustand";
import "@tanstack/react-query-devtools";
import "next-themes";
import "react-helmet-async";
import "react-dom/client";
import "@tanstack/react-router-devtools";
import "@tanstack/react-devtools";
const Spinner = () => /* @__PURE__ */ jsx(
  "span",
  {
    className: `inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin align-middle`,
    "aria-label": "Loading...",
    role: "status"
  }
);
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("bg-accent animate-pulse rounded-md", className),
      ...props
    }
  );
}
function ResumeSkeleton() {
  return /* @__PURE__ */ jsx("div", { className: "space-y-4 bg-black text-white relative", children: /* @__PURE__ */ jsxs("div", { className: "w-full flex items-start gap-0 justify-center h-[800px]", children: [
    /* @__PURE__ */ jsxs("div", { className: "hidden lg:flex flex-col space-y-4 p-4 w-[250px] border-r border-white/20", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-[80%] bg-white/10" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-[70%] bg-white/10" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-[60%] bg-white/10" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-[90%] bg-white/10" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-[50%] bg-white/10" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "lg:py-4 lg:pr-4 w-full  lg:mt-5 flex justify-center", children: /* @__PURE__ */ jsxs("div", { className: "w-full lg:w-[80%] h-[750px] rounded-lg border border-white/10 bg-[#1a1a1a] flex flex-col p-6 space-y-4", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-[60%] bg-white/10" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-[40%] bg-white/10" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-[500px] w-full bg-white/10 rounded-md" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-[30%] bg-white/10" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: " w-full h-screen flex items-center gap-5 -top-35  justify-center text-white absolute", children: [
      /* @__PURE__ */ jsx(Spinner, {}),
      " Tailoring resume"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "hidden lg:flex flex-col space-y-5 p-5 w-[300px]", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-full bg-white/10" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-full bg-white/10" }),
      /* @__PURE__ */ jsxs("div", { className: "bg-[#2c5530] p-4 rounded-md mt-5 space-y-3", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-[60%] bg-white/20" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-[80%] bg-white/20" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-[70%] bg-white/20" })
      ] })
    ] })
  ] }) });
}
const getTailoredResume = async ({
  jobDescription,
  file
}) => {
  if (!file || jobDescription.trim() === "") {
    toast.error("Please provide both a job description and a resume file.");
    return;
  }
  try {
    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    formData.append("resume", file);
    const response = await axios.post(
      `${"https://jobbygenie.onrender.com"}/api/v1/resumes/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
    return response.data;
  } catch (_err) {
  }
};
function RouteComponent() {
  var _a;
  const [data, setData] = useState({
    jobDescription: "",
    file: null
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    page,
    setPage
  } = useCurrentPage();
  const mutation = useMutation({
    mutationFn: async (resumeData) => {
      const timeout = 1e6;
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Request timed out")), timeout));
      return Promise.race([getTailoredResume(resumeData), timeoutPromise]);
    },
    onSuccess: (resumeData) => {
      toast.success("Resume tailor successful");
      queryClient.setQueryData(["tailoredResume"], resumeData.data.data);
      navigate({
        to: "/build-resume"
      });
    },
    onError: (err) => {
      console.error("Upload failed:", err);
      toast.error("Tailoring failed");
    }
  });
  useEffect(() => {
    setPage("tailorPage");
    wakeServer(false);
  }, [page, setPage]);
  return /* @__PURE__ */ jsxs(App, { children: [
    /* @__PURE__ */ jsx(SEO, { title: "Tailor Resume", description: "Build your professional resume easily." }),
    mutation.isPending ? /* @__PURE__ */ jsx(ResumeSkeleton, {}) : /* @__PURE__ */ jsxs("form", { className: "bg-black text-white h-screen relative flex items-center flex-col gap-0", onSubmit: (e) => {
      e.preventDefault();
      mutation.mutate(data);
    }, children: [
      /* @__PURE__ */ jsx("div", { className: "w-full md:w-4/5 overflow-hidden rounded-xl px-6 mt-5", children: /* @__PURE__ */ jsx(Textarea, { labelFor: "tailorJobDesc", value: data.jobDescription, onChange: (e) => {
        setData((prev) => ({
          ...prev,
          jobDescription: e.target.value
        }));
      }, inputTittle: "Job Description", placeholder: "Enter Job description", inputHeight: "40vh", inputBG: "#27272a", noBorder: false, rounded: false }) }),
      /* @__PURE__ */ jsxs("span", { className: "relative w-fit flex items-center justify-center", children: [
        /* @__PURE__ */ jsx("input", { type: "file", id: "resumeUpload", onChange: (e) => {
          var _a2;
          const file = ((_a2 = e.currentTarget.files) == null ? void 0 : _a2[0]) || null;
          setData((prev) => ({
            ...prev,
            file
          }));
          file ? toast.success("Resume uploaded successfully") : toast.error("Resume upload failed");
        }, accept: ".pdf,.doc,.docx", className: "absolute  w-full h-full opacity-0 cursor-pointer " }),
        /* @__PURE__ */ jsxs("label", { htmlFor: "resumeUpload", className: "flex flex-col justify-center items-center gap-3 border-2 border-zinc-300 w-[300px] p-6 rounded-xl mb-10 cursor-pointer", children: [
          /* @__PURE__ */ jsx(Upload, { className: "w-5 h-5 z-2" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm text-center flex justify-center z-2", children: data.file ? (_a = data.file) == null ? void 0 : _a.name : "Upload Resume" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("button", { type: "submit", className: `flex justify-center items-center gap-3 border-2 border-zinc-300  font-medium px-5 py-3 rounded-xl transition relative
            shadow-sm hover:shadow-md  w-[200px] overflow-hidden text-zinc-800 
       ${mutation.isPending || !data.file || !data.jobDescription ? "bg-zinc-400 cursor-not-allowed" : `
            bg-zinc-50 hover:bg-zinc-100 cursor-pointer
            before:content-[''] before:absolute before:left-0 before:top-0 
            before:h-0 before:w-full before:bg-black before:border-zinc-50 before:transition-all before:duration-300
            hover:before:h-full hover:text-white     
            `}
          `, disabled: mutation.isPending || !data.file || !data.jobDescription, children: /* @__PURE__ */ jsxs("span", { className: "z-2 flex gap-2 items-center justify-center", children: [
        /* @__PURE__ */ jsx(Send, {}),
        " ",
        mutation.isPending ? "Tailoring" : "Tailor",
        " ",
        mutation.isPending ? /* @__PURE__ */ jsx(Spinner, {}) : ""
      ] }) })
    ] })
  ] });
}
export {
  RouteComponent as component
};
