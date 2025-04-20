import { useEffect } from "react";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { useAuthStore } from "./store/authStore";
import { theme } from "./theme";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { BaseRouter } from "./routes/BaseRouter";
import { ProjectRouter } from "./routes/ProjectRouter";
import { getSubdomain } from "./lib/subdomain";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
  const subdomain = getSubdomain();
  const listenForAuthStateChange = useAuthStore(
    (state) => state.listenForAuthStateChange
  );

  useEffect(() => {
    return listenForAuthStateChange();
  }, [listenForAuthStateChange]);

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <ModalsProvider>
          <Notifications position="top-center" zIndex={1000} />
          <BrowserRouter>
            {subdomain ? <ProjectRouter /> : <BaseRouter />}
          </BrowserRouter>
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}
