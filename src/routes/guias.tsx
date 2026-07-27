import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/guias")({
  component: GuiasLayout,
});

function GuiasLayout() {
  return <Outlet />;
}
