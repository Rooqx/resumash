import { jsx, Fragment, jsxs } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { A as App, S as SEO } from "./SEO-ru4NyDif.js";
import { w as wakeServer } from "./wakeServer-_xVPpTf7.js";
import "../main.mjs";
import "@tanstack/react-query";
import "@tanstack/react-query-devtools";
import "lucide-react";
import "next-themes";
import "sonner";
import "zustand";
import "react-helmet-async";
import "axios";
import "react-dom/client";
import "@tanstack/react-router-devtools";
import "@tanstack/react-devtools";
function RouteComponent() {
  useEffect(() => {
    wakeServer(true);
  }, []);
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(App, { children: [
    /* @__PURE__ */ jsx(SEO, { title: "Home - Resume Builder", description: "Build your professional resume easily." }),
    /* @__PURE__ */ jsx("section", { className: "bg-black w-full h-[calc(100vh-5rem)] text-slate-100 flex items-center justify-center ", children: /* @__PURE__ */ jsxs("div", { className: " flex flex-col gap-5 w-full items-center justify-center  -mt-40 md:-mt-40 lg:-mt-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-3 w-full mb-2", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs py-2.5 md:py-1 px-4 border border-zinc-800 rounded-full mx-auto font-medium text-center w-fit shadow-[0_0_10px_rgba(255,255,255,0.5)]", children: "Tailor Your Resume for Every Job Instantly." }),
        /* @__PURE__ */ jsx("p", { className: "w-full md:w-[60%] text-4xl px-5 py-2 italic font-bold text-center mx-auto text-zinc-50 leading-[1.3] lg:leading-[1.5]", children: "Create and customize resumes that fit every job effortlessly" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-5 flex-col md:flex-row justify-center items-center w-full py-6 px-4", children: [
        /* @__PURE__ */ jsx(Link, { to: "/tailor-resume", className: `
            font-semibold text-nowrap text-xl w-full md:w-[40%] text-center border-2 border-zinc-50 py-3 px-6 rounded-full relative
            tailor-resume bg-zinc-50 hover:bg-zinc-900 text-zinc-800 transition-all duration-100 md:duration-300 hover:text-white
            `, children: "Tailor My Resume Now" }),
        /* @__PURE__ */ jsx(Link, { to: "/build-resume", className: `
            font-semibold text-nowrap text-xl w-full md:w-[40%] text-center border-2 border-zinc-50 py-3 px-6 rounded-full relative
            tailor-resume bg-zinc-50 hover:bg-zinc-900 text-zinc-800 transition-all duration-100 md:duration-300 hover:text-white
            `, children: "Build Resume" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "font-thin text-zinc-50", children: "Build Tailor Get hired" })
    ] }) })
  ] }) });
}
export {
  RouteComponent as component
};
