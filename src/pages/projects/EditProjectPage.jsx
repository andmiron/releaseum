import {
  TextInput,
  Textarea,
  Button,
  Title,
  Stack,
  Group,
  LoadingOverlay,
  Text,
} from "@mantine/core";
import { useEffect } from "react";
import { useForm, isNotEmpty } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ProjectsRepository } from "../../lib/repositories/projectsRepository";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import slugify from "slugify";

export function EditProjectPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { projectSlug } = useParams();

  const {
    data: project,
    isLoading: isProjectLoading,
    isError: isProjectError,
  } = useQuery({
    queryKey: ["project", projectSlug],
    queryFn: () => ProjectsRepository.getProjectBySlug(projectSlug),
  });

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      description: "",
    },
    validate: {
      name: isNotEmpty("Project name is required"),
      description: isNotEmpty("Description is required"),
    },
  });

  useEffect(() => {
    if (project) {
      form.setValues({
        name: project.name,
        description: project.description,
      });
    }
  }, [project]);

  const updateProjectMutation = useMutation({
    mutationFn: ({ id, name, slug, description }) =>
      ProjectsRepository.updateProject(id, name, slug, description),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", projectSlug] });

      notifications.show({
        title: "Success!",
        message: "Project updated successfully",
        color: "green",
      });
      navigate(`/dashboard/projects/${data.slug}`);
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        message: error.message,
        color: "red",
      });
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    if (!project) return;

    const newSlug = slugify(values.name, { lower: true, strict: true });

    updateProjectMutation.mutate({
      id: project.id,
      name: values.name,
      slug: newSlug,
      description: values.description,
    });
  });

  if (isProjectError) {
    return (
      <Stack align="center" gap="md" py={50}>
        <Text size="lg" c="red">
          Error loading project
        </Text>
        <Text c="dimmed" ta="center" maw={400}>
          Please try again later or contact support if the problem persists.
        </Text>
      </Stack>
    );
  }

  if (isProjectLoading || updateProjectMutation.isPending) {
    return (
      <Stack align="center" gap="md" py={50}>
        <LoadingOverlay visible />
      </Stack>
    );
  }

  return (
    <Stack gap="lg">
      <Group justify="flex-start" align="center">
        <Link
          to={`/dashboard/projects`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Title fw={200}>Projects</Title>
        </Link>
        <Title fw={200}>&gt;</Title>

        <Link
          to={`/dashboard/projects/${project?.slug}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Title fw={200}>{project?.name || "Loading..."}</Title>
        </Link>
        <Title fw={200}>&gt;</Title>
        <Title fw={200}>Edit</Title>
      </Group>

      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Project Name"
            placeholder="Enter project name"
            required
            {...form.getInputProps("name")}
          />

          <Textarea
            label="Description"
            placeholder="Describe your project"
            required
            autosize
            minRows={5}
            {...form.getInputProps("description")}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" component={Link} to={`..`}>
              Cancel
            </Button>
            <Button type="submit" disabled={!project}>
              Save Changes
            </Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
}
