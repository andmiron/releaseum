import { useAuthStore } from "../store/authStore";
import { Link } from "react-router-dom";
import { UnstyledButton, Group, Text } from "@mantine/core";
import { Logout } from "./Logout";

export function Header() {
  const session = useAuthStore((state) => state.session);

  return (
    <Group h="100%" justify="space-between">
      <Group>
        <UnstyledButton component={Link} to="/">
          <Text size="xl" fw={400}>
            Releaseum
          </Text>
        </UnstyledButton>
      </Group>
      {session ? (
        <Group>
          <UnstyledButton component={Link} to="/dashboard">
            <Text>Dashboard</Text>
          </UnstyledButton>
          <Logout />
        </Group>
      ) : (
        <Group>
          <UnstyledButton component={Link} to="/login">
            <Text>Login</Text>
          </UnstyledButton>
          <UnstyledButton component={Link} to="/register">
            <Text>Register</Text>
          </UnstyledButton>
        </Group>
      )}
    </Group>
  );
}
