import {
  Title,
  Button,
  Group,
  Card,
  Text,
  SimpleGrid,
  Stack,
  Badge,
  ActionIcon,
  Menu,
  LoadingOverlay,
  Center,
  Divider,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import {
  RiAddLine,
  RiMoreLine,
  RiEditLine,
  RiDeleteBinLine,
  RiEyeLine,
  RiGitBranchLine,
} from "react-icons/ri";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ProjectsRepository } from "../../lib/repositories/projectsRepository";
import { useAuthStore } from "../../store/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function ProjectsPage() {
  const ownerId = useAuthStore((state) => state.session.user.id);
  const queryClient = useQueryClient();

  const {
    data: projects = [],
    isPending: getProjectsPending,
    isError: getProjectsError,
  } = useQuery({
    queryKey: ["projects", ownerId],
    queryFn: () => ProjectsRepository.getProjectsByOwnerId(ownerId),
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (projectId) => ProjectsRepository.deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      notifications.show({
        title: "Success",
        message: "Project has been deleted successfully",
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to delete project. Please try again.",
        color: "red",
      });
    },
  });

  const handleDeleteProject = (projectId) => {
    modals.openConfirmModal({
      title: "Delete Project",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this project? This action cannot be
          undone. All related documents will be lost.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => deleteProjectMutation.mutate(projectId),
    });
  };

  if (getProjectsError) {
    return (
      <Center>
        <Text c="red">Error loading projects. Please try again later.</Text>
      </Center>
    );
  }

  return (
    <Stack gap="lg" pos="relative">
      {getProjectsPending && <LoadingOverlay visible />}
      <Group justify="space-between" align="center">
        <Title fw={200}>Projects</Title>
        <Button
          leftSection={<RiAddLine size="1.2rem" />}
          component={Link}
          to="new"
        >
          Create New Project
        </Button>
      </Group>

      <Divider />

      {projects.length === 0 ? (
        <Stack align="center" gap="md" py={50}>
          <Text size="lg" c="dimmed">
            No projects found
          </Text>
          <Text c="dimmed" ta="center" maw={400}>
            Get started by creating your first project. Click the "Create New
            Project" button above.
          </Text>
        </Stack>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {projects?.map((project) => (
            <Card key={project.id} withBorder padding="md" radius="md">
              <Card.Section withBorder inheritPadding py="xs">
                <Group justify="space-between" wrap="nowrap">
                  <Text
                    fw={400}
                    truncate
                    component={Link}
                    to={`${project.slug}`}
                  >
                    {project.name}
                  </Text>
                  <Menu shadow="md" width={200}>
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray">
                        <RiMoreLine size="1.2rem" />
                      </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<RiEyeLine size="1rem" />}
                        component={Link}
                        to={`${project.slug}`}
                      >
                        View
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<RiEditLine size="1rem" />}
                        component={Link}
                        to={`${project.slug}/edit`}
                      >
                        Edit
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item
                        leftSection={<RiDeleteBinLine size="1rem" />}
                        color="red"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        Delete
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </Card.Section>

              <Stack gap="sm" mt="md" w="100%">
                <Text size="sm" c="dimmed" truncate="end">
                  {project.description}
                </Text>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}
