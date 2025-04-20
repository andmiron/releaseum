import {
  TextInput,
  Textarea,
  Button,
  Paper,
  Title,
  Stack,
  Select,
  Group,
  LoadingOverlay,
} from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { ProjectsRepository } from "../lib/repositories/projectsRepository";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import slugify from "slugify";

export function NewProject() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createProjectMutation = useMutation({
    mutationFn: ({ name, slug, description }) =>
      ProjectsRepository.createProject(name, slug, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      notifications.show({
        title: "Success!",
        message: "Project created successfully",
        color: "green",
      });
      navigate("..");
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        message: error.message,
        color: "red",
      });
    },
  });

  const projectCreateForm = useForm({
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

  const handleSubmitRegister = async (values) => {
    const slug = slugify(values.name, { lower: true, strict: true });
    createProjectMutation.mutate({
      name: values.name,
      slug,
      description: values.description,
    });
  };

  return (
    <Stack gap="lg" pos="relative">
      {createProjectMutation.isPending && <LoadingOverlay visible />}
      <Title fw={200}>Create New Project</Title>

      <form onSubmit={projectCreateForm.onSubmit(handleSubmitRegister)}>
        <Stack gap="md">
          <TextInput
            label="Project Name"
            placeholder="Enter project name"
            required
            {...projectCreateForm.getInputProps("name")}
          />

          <Textarea
            label="Description"
            placeholder="Describe your project"
            required
            minRows={3}
            {...projectCreateForm.getInputProps("description")}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => navigate("..")}>
              Cancel
            </Button>
            <Button type="submit">Create Project</Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
}
