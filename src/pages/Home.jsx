import { Container, Title, Text, Button, Group, Stack } from "@mantine/core";

export function Home() {
  return (
    <Container size="lg" py={80}>
      <Stack gap="xl" align="center">
        <Title order={1} ta="center" style={{ fontWeight: "200" }}>
          Welcome to Releaseum
        </Title>

        <Text c="dimmed" size="lg" ta="center" maw={600}>
          Manage your software releases, track versions, and collaborate with
          your team. Streamline your development workflow with our powerful
          tools.
        </Text>
      </Stack>
    </Container>
  );
}
