import { useParams, Link } from "react-router-dom";
import {
  Title,
  Text,
  Stack,
  Group,
  Button,
  Card,
  Badge,
  ActionIcon,
  Menu,
  LoadingOverlay,
  Divider,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  RiAddLine,
  RiMoreLine,
  RiEditLine,
  RiDeleteBinLine,
  RiEyeLine,
  RiCalendarLine,
  RiTimeLine,
} from "react-icons/ri";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { ProjectsRepository } from "../../lib/repositories/projectsRepository";
import { DocumentsRepository } from "../../lib/repositories/documentsRepository";
import { DocumentCard } from "../../components/DocumentCard";
import { notifications } from "@mantine/notifications";

export function ProjectViewPage() {
  const queryClient = useQueryClient();
  const { projectSlug } = useParams();

  const {
    data: project,
    isPending: isProjectLoading,
    isError: isProjectError,
  } = useQuery({
    queryKey: ["project", projectSlug],
    queryFn: () => ProjectsRepository.getProjectBySlug(projectSlug),
  });

  const {
    data: documents = [],
    isPending: isDocumentsLoading,
    isError: isDocumentsError,
  } = useQuery({
    queryKey: ["documents", project?.id],
    queryFn: () => DocumentsRepository.getDocumentsByProjectId(project?.id),
    enabled: !!project?.id,
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: (documentId) => DocumentsRepository.deleteDocument(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", project?.id] });

      notifications.show({
        title: "Document deleted",
        message: "The document has been deleted successfully",
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to delete document",
        color: "red",
      });
    },
  });

  const handleDeleteDocument = (documentId) => {
    modals.openConfirmModal({
      title: "Delete Document",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this document? This action cannot be
          undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        deleteDocumentMutation.mutate(documentId);
      },
    });
  };

  if (isProjectError || isDocumentsError) {
    return (
      <Stack align="center" gap="md" py={50}>
        <Text size="lg" c="red">
          Error loading project data
        </Text>
        <Text c="dimmed" ta="center" maw={400}>
          Please try again later or contact support if the problem persists.
        </Text>
      </Stack>
    );
  }

  return (
    <Stack gap="lg">
      {(isProjectLoading || isDocumentsLoading) && <LoadingOverlay visible />}

      {project && (
        <>
          <Stack gap="xs">
            <Group justify="space-between" align="center">
              <Group justify="flex-start" align="center">
                <Link
                  to=".."
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Title fw={200}>Projects</Title>
                </Link>
                <Title fw={200}>&gt;</Title>
                <Title fw={200}>{project.name}</Title>
              </Group>
              <Group>
                <Button
                  variant="light"
                  component={Link}
                  to="edit"
                  leftSection={<RiEditLine size="1.2rem" />}
                >
                  Edit Project
                </Button>
              </Group>
            </Group>

            <Text size="sm" c="dimmed" style={{ wordBreak: "break-word" }}>
              {project.description}
            </Text>
          </Stack>

          <Divider />

          <Stack gap="md">
            <Group justify="space-between" align="center">
              <Title order={2} fw={200}>
                Documents
              </Title>
              <Button
                component={Link}
                to="new-document"
                leftSection={<RiAddLine size="1.2rem" />}
              >
                New Document
              </Button>
            </Group>

            {documents.length === 0 ? (
              <Stack align="center" gap="md" py={50}>
                <Text size="lg" c="dimmed">
                  No documents found
                </Text>
                <Text c="dimmed" ta="center" maw={400}>
                  Get started by creating your first document. Click the "New
                  Document" button above.
                </Text>
              </Stack>
            ) : (
              <Stack gap="md">
                {documents.map((document) => (
                  <Card key={document.id} withBorder padding="md" radius="md">
                    <DocumentCard
                      document={document}
                      handleDeleteDocument={handleDeleteDocument}
                    />
                  </Card>
                ))}
              </Stack>
            )}
          </Stack>
        </>
      )}
    </Stack>
  );
}
