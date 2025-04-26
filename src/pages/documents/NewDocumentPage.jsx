import { useNavigate } from "react-router-dom";
import {
  Title,
  Button,
  Group,
  TextInput,
  Stack,
  LoadingOverlay,
  Text,
  Divider,
} from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DocumentsRepository } from "../../lib/repositories/documentsRepository";
import { useAuthStore } from "../../store/authStore";
import { TextEditor } from "../../components/textEditor/TextEditor";
import { ProjectsRepository } from "../../lib/repositories/projectsRepository";
import { useParams } from "react-router-dom";
import slugify from "slugify";

export function NewDocumentPage() {
  const navigate = useNavigate();
  const ownerId = useAuthStore((state) => state.session.user.id);
  const { projectSlug } = useParams();

  const {
    data: project,
    isLoading: isProjectLoading,
    isError: isProjectError,
  } = useQuery({
    queryKey: ["projects", projectSlug],
    queryFn: () => ProjectsRepository.getProjectBySlug(projectSlug),
  });

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      content: "",
    },
    validate: {
      title: isNotEmpty("Title is required"),
      content: isNotEmpty("Content is required"),
    },
  });

  const createDocument = useMutation({
    mutationFn: ({ projectId, ownerId, title, slug, content }) => {
      return DocumentsRepository.createDocument(
        projectId,
        ownerId,
        title,
        slug,
        content
      );
    },
    onSuccess: (newDocument) => {
      notifications.show({
        title: "Success",
        message: "Document created successfully",
        color: "green",
      });
      navigate(`../${newDocument.id}`);
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to create document",
        color: "red",
      });
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    const titleSlug = slugify(values.title, { lower: true, strict: true });

    createDocument.mutate({
      projectId: project.id,
      ownerId,
      title: values.title,
      slug: titleSlug,
      content: values.content,
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

  if (isProjectLoading || createDocument.isPending) {
    return (
      <Stack align="center" gap="md" py={50}>
        <LoadingOverlay visible />
      </Stack>
    );
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center">
        <Title fw={200}>Create New Document</Title>
      </Group>

      <Divider />

      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Document Title"
            placeholder="Enter document title"
            required
            {...form.getInputProps("title")}
          />

          <TextEditor
            onChange={(content) => form.setFieldValue("content", content)}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => navigate(`..`)}>
              Cancel
            </Button>
            <Button type="submit">Create Document</Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
}
