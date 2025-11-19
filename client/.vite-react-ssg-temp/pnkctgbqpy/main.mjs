import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createRootRoute, Outlet, useRouterState, createFileRoute, lazyRouteComponent, createRouter, RouterProvider } from "@tanstack/react-router";
import { useIsFetching, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HelmetProvider } from "react-helmet-async";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanstackDevtools } from "@tanstack/react-devtools";
function NavigationLoader() {
  const isFetching = useIsFetching();
  const routerState = useRouterState();
  const isNavigating = routerState.isLoading;
  const showLoader = isFetching > 0 || isNavigating;
  if (!showLoader) return null;
  return /* @__PURE__ */ jsx("div", { className: "w-screen h-screen bg-black flex justify-center items-center fixed top-0 z-[60]", children: /* @__PURE__ */ jsx("span", { className: `inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin align-middle`, "aria-label": "Loading...", role: "status" }) });
}
const Route$4 = createRootRoute({
  component: () => /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Outlet, {}),
    /* @__PURE__ */ jsx(NavigationLoader, {}),
    /* @__PURE__ */ jsx(TanstackDevtools, { config: {
      position: "bottom-left"
    }, plugins: [{
      name: "Tanstack Router",
      render: /* @__PURE__ */ jsx(TanStackRouterDevtoolsPanel, {})
    }] })
  ] })
});
const $$splitComponentImporter$3 = () => import("./assets/rxsme-DaLq98p0.js");
const Route$3 = createFileRoute("/rxsme")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./assets/index-D80tOvvW.js");
const Route$2 = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./assets/index-D4z2YT6i.js");
const Route$1 = createFileRoute("/tailor-resume/")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./assets/index-BkJFlbHD.js");
const Route = createFileRoute("/build-resume/")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const RxsmeRoute = Route$3.update({
  id: "/rxsme",
  path: "/rxsme",
  getParentRoute: () => Route$4
});
const IndexRoute = Route$2.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$4
});
const TailorResumeIndexRoute = Route$1.update({
  id: "/tailor-resume/",
  path: "/tailor-resume/",
  getParentRoute: () => Route$4
});
const BuildResumeIndexRoute = Route.update({
  id: "/build-resume/",
  path: "/build-resume/",
  getParentRoute: () => Route$4
});
const rootRouteChildren = {
  IndexRoute,
  RxsmeRoute,
  BuildResumeIndexRoute,
  TailorResumeIndexRoute
};
const routeTree = Route$4._addFileChildren(rootRouteChildren)._addFileTypes();
const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0
});
const queryClient = new QueryClient();
const helmetContext = {};
const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    /* @__PURE__ */ jsx(StrictMode, { children: /* @__PURE__ */ jsx(HelmetProvider, { context: helmetContext, children: /* @__PURE__ */ jsxs(QueryClientProvider, { client: queryClient, children: [
      /* @__PURE__ */ jsx(RouterProvider, { router }),
      /* @__PURE__ */ jsx(ReactQueryDevtools, { initialIsOpen: false })
    ] }) }) })
  );
}
