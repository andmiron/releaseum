import { AppShell } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { DashboardNav } from "../components/DashboardNav";

export function DashboardLayout() {
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: { base: 200, md: 250, lg: 300 } }}
      padding="md"
    >
      <AppShell.Header p="md">
        <Header />
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <DashboardNav />
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
