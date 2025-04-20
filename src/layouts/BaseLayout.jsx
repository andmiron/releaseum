import { AppShell } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";

export function BaseLayout() {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header p="md">
        <Header />
      </AppShell.Header>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
