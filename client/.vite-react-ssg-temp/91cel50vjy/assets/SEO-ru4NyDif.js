import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Loader2Icon, OctagonXIcon, TriangleAlertIcon, InfoIcon, CircleCheckIcon, Linkedin, LucideTwitter } from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Toaster$1 } from "sonner";
import { useEffect } from "react";
import { useRouterState, Link } from "@tanstack/react-router";
import { create } from "zustand";
import { Helmet } from "react-helmet-async";
const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      theme,
      className: "toaster group",
      icons: {
        success: /* @__PURE__ */ jsx(CircleCheckIcon, { className: "size-4" }),
        info: /* @__PURE__ */ jsx(InfoIcon, { className: "size-4" }),
        warning: /* @__PURE__ */ jsx(TriangleAlertIcon, { className: "size-4" }),
        error: /* @__PURE__ */ jsx(OctagonXIcon, { className: "size-4" }),
        loading: /* @__PURE__ */ jsx(Loader2Icon, { className: "size-4 animate-spin" })
      },
      style: {
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
        "--border-radius": "var(--radius)"
      },
      ...props
    }
  );
};
function ToasterProvider() {
  return /* @__PURE__ */ jsx(
    Toaster,
    {
      position: "top-right",
      richColors: true,
      closeButton: true,
      theme: "light",
      duration: 3e3
    }
  );
}
const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
function Footer({
  showSocial = true,
  tagline = "Build, Tailor,  Get Hired."
}) {
  return /* @__PURE__ */ jsx("footer", { className: "w-full bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 mt-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6 py-8 md:py-10", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-md bg-black text-white flex items-center justify-center font-semibold", children: "R" }),
          /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold", children: "Resumash" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-gray-600 dark:text-gray-300 max-w-md", children: tagline })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-4", children: [
        /* @__PURE__ */ jsxs("nav", { "aria-label": "footer-navigation", className: "flex gap-4 text-sm", children: [
          /* @__PURE__ */ jsx("a", { href: "/privacy", className: "hover:underline", children: "Privacy" }),
          /* @__PURE__ */ jsx("a", { href: "/terms", className: "hover:underline", children: "Terms" }),
          /* @__PURE__ */ jsx("a", { href: "/support", className: "hover:underline", children: "Support" })
        ] }),
        showSocial && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mt-2 sm:mt-0", children: [
          /* @__PURE__ */ jsx(
            SocialLink,
            {
              href: "https://www.linkedin.com/company/resumash",
              label: "Resumash on LinkedIn",
              children: /* @__PURE__ */ jsx(Linkedin, {})
            }
          ),
          /* @__PURE__ */ jsx(SocialLink, { href: "https://x.com/resumash", label: "Resumash on X", children: /* @__PURE__ */ jsx(LucideTwitter, {}) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 border-t border-gray-200 dark:border-gray-800 pt-6 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-600 dark:text-gray-400", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        "© ",
        currentYear,
        " Resumash. All rights reserved."
      ] }),
      /* @__PURE__ */ jsx("div", { className: "text-xs", children: "Made with care • ATS-friendly templates" })
    ] }) })
  ] }) });
}
function SocialLink({
  href,
  children,
  label
}) {
  return /* @__PURE__ */ jsxs(
    "a",
    {
      href,
      target: "_blank",
      rel: "noopener noreferrer",
      "aria-label": label,
      className: "group p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition",
      children: [
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: label }),
        /* @__PURE__ */ jsx("div", { className: "w-6 h-6", children })
      ]
    }
  );
}
const useCurrentPage = create((set) => ({
  page: "homePage",
  setPage: (page) => set({ page })
}));
function Header() {
  const { page, setPage } = useCurrentPage();
  const isLoading = useRouterState();
  useEffect(() => {
    setPage("homePage");
  }, [page, setPage]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "bg-black w-full h-0.5" }),
    /* @__PURE__ */ jsx(
      "header",
      {
        className: "py-2 flex gap-2 bg-zinc-800 mb-5 w-[98%] md:w-[90%] mx-auto shadow-[0_0_10px_0_rgba(255,255,255,0.5)] border-zinc-400 mt-3 text-white justify-between rounded-full",
        style: { zIndex: isLoading.isLoading ? 100 : 1 },
        children: /* @__PURE__ */ jsxs("nav", { className: "flex flex-row justify-between w-full items-center text-xs md:text-sm", children: [
          /* @__PURE__ */ jsx("div", { className: "px-6 font-bold", children: /* @__PURE__ */ jsx(Link, { to: "/", className: "text-2xl md:text-4xl logo", children: "resumeash" }) }),
          /* @__PURE__ */ jsx("div", { className: "px-2 font-bold flex gap-3", children: page === "homePage" ? /* @__PURE__ */ jsx(
            Link,
            {
              to: "/tailor-resume",
              className: "flex justify-center items-center gap-3 border-2 border-zinc-300 \n               bg-zinc-50 hover:bg-zinc-100 text-zinc-800  text-xs md:text-sm\n               font-medium py-2 px-4 rounded-4xl transition relative\n               shadow-sm hover:shadow-md cursor-pointer  md:w-[200px] overflow-hidden\n               before:content-[''] before:absolute before:left-0 before:top-0 \n               before:h-0 before:w-full before:bg-black before:border-zinc-50 before:transition-all before:duration-300\n               hover:before:h-full hover:text-white\n               ",
              children: /* @__PURE__ */ jsx("p", { className: "z-2", children: "Tailor Resume" })
            }
          ) : page === "tailorPage" ? /* @__PURE__ */ jsx(
            Link,
            {
              to: "/build-resume",
              className: "flex justify-center items-center gap-3 border-2 border-zinc-300 \n               bg-zinc-50 hover:bg-zinc-100 text-zinc-800  text-xs md:text-sm\n               font-medium py-2 px-4 rounded-4xl transition relative\n               shadow-sm hover:shadow-md cursor-pointer  md:w-[200px] overflow-hidden\n               before:content-[''] before:absolute before:left-0 before:top-0 \n               before:h-0 before:w-full before:bg-black before:border-zinc-50 before:transition-all before:duration-300\n               hover:before:h-full hover:text-white\n               ",
              children: /* @__PURE__ */ jsx("p", { className: "z-2", children: "Build Resume" })
            }
          ) : /* @__PURE__ */ jsx(
            Link,
            {
              to: "/tailor-resume",
              className: "flex justify-center items-center gap-3 border-2 border-zinc-300 \n               bg-zinc-50 hover:bg-zinc-100 text-zinc-800  text-xs md:text-sm\n               font-medium py-2 px-4 rounded-4xl transition relative\n               shadow-sm hover:shadow-md cursor-pointer  md:w-[200px] overflow-hidden\n               before:content-[''] before:absolute before:left-0 before:top-0 \n               before:h-0 before:w-full before:bg-black before:border-zinc-50 before:transition-all before:duration-300\n               hover:before:h-full hover:text-white\n               ",
              children: /* @__PURE__ */ jsx("p", { className: "z-2", children: "Tailor Resume" })
            }
          ) })
        ] })
      }
    )
  ] });
}
const queryClient = new QueryClient();
function App({ children }) {
  return /* @__PURE__ */ jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-black m-0", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx("main", { className: "poppins", children }),
      /* @__PURE__ */ jsx(ToasterProvider, {}),
      /* @__PURE__ */ jsx(Footer, {})
    ] }),
    /* @__PURE__ */ jsx(ReactQueryDevtools, { initialIsOpen: false })
  ] });
}
function SEO({ title, description }) {
  return /* @__PURE__ */ jsxs(Helmet, { children: [
    /* @__PURE__ */ jsx("title", { children: title }),
    description && /* @__PURE__ */ jsx("meta", { name: "description", content: description })
  ] });
}
export {
  App as A,
  SEO as S,
  useCurrentPage as u
};
