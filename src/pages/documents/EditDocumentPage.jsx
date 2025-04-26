import { useParams, useNavigate } from "react-router-dom";
import { DocumentsRepository } from "../../lib/repositories/documentsRepository";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Stack,
  Title,
  Text,
  LoadingOverlay,
  Group,
  Button,
  TextInput,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { useForm, isNotEmpty } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { TextEditor } from "../../components/textEditor/TextEditor";
import { useAuthStore } from "../../store/authStore";
import slugify from "slugify";
import { useEffect } from "react";

export function EditDocumentPage() {
  const ownerId = useAuthStore((state) => state.session.user.id);
  const { documentId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: document,
    isLoading: isDocumentLoading,
    isError: isDocumentError,
  } = useQuery({
    queryKey: ["document", documentId],
    queryFn: () => DocumentsRepository.getDocumentById(documentId),
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

  useEffect(() => {
    if (document) {
      form.setValues({
        title: document.title,
        content: document.content,
      });
    }
  }, [document]);

  const updateDocumentMutation = useMutation({
    mutationFn: ({ id, title, slug, content }) =>
      DocumentsRepository.updateDocument(ownerId, id, title, slug, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["document", documentId] });
      queryClient.invalidateQueries({ queryKey: ["documents"] });

      notifications.show({
        title: "Success!",
        message: "Document updated successfully",
        color: "green",
      });
      navigate(`..`);
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
    const slug = slugify(values.title, { lower: true, strict: true });
    if (!document) return;
    updateDocumentMutation.mutate({
      id: document.id,
      title: values.title,
      slug,
      content: values.content,
    });
  });

  if (isDocumentError) {
    return (
      <Stack align="center" gap="md" py={50}>
        <Text size="lg" c="red">
          Error loading document
        </Text>
        <Text c="dimmed" ta="center" maw={400}>
          Please try again later or contact support if the problem persists.
        </Text>
      </Stack>
    );
  }

  return (
    <Stack gap="lg">
      {(isDocumentLoading || updateDocumentMutation.isPending) && (
        <LoadingOverlay visible />
      )}

      <Group justify="space-between" align="center">
        <Title fw={200}>Edit Document</Title>
      </Group>

      {document && (
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              label="Document Title"
              placeholder="Enter document title"
              required
              {...form.getInputProps("title")}
            />

            <TextEditor
              content={document.content}
              onChange={(content) => form.setFieldValue("content", content)}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="light" component={Link} to="../..">
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </Group>
          </Stack>
        </form>
      )}
    </Stack>
  );
}
