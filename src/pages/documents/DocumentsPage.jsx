import {
  Title,
  Button,
  Group,
  Text,
  Stack,
  Center,
  ActionIcon,
  Menu,
  Card,
  Badge,
  LoadingOverlay,
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
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "../../utils/formatDate";
import { DocumentsRepository } from "../../lib/repositories/documentsRepository";

export function DocumentsPage() {
  const ownerId = useAuthStore((state) => state.session.user.id);

  const {
    data: documents = [],
    isPending: getDocumentsPending,
    isError,
  } = useQuery({
    queryKey: ["documents", ownerId],
    queryFn: () => DocumentsRepository.getDocumentsByOwnerId(ownerId),
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
        console.log("Deleting document:", documentId);
      },
    });
  };

  if (isError) {
    return (
      <Stack align="center" gap="md" py={50}>
        <Text size="lg" c="red">
          Error loading documents
        </Text>
        <Text c="dimmed" ta="center" maw={400}>
          Please try again later or contact support if the problem persists.
        </Text>
      </Stack>
    );
  }

  return (
    <Stack gap="lg" pos="relative">
      {getDocumentsPending && <LoadingOverlay visible />}
      <Group justify="space-between" align="center">
        <Title fw={200}>Documents</Title>
        <Button
          leftSection={<RiAddLine size="1.2rem" />}
          component={Link}
          to="new"
        >
          Create New Document
        </Button>
      </Group>

      {documents.length === 0 ? (
        <Stack align="center" gap="md" py={50}>
          <Text size="lg" c="dimmed">
            No documents found
          </Text>
          <Text c="dimmed" ta="center" maw={400}>
            Get started by creating your first document. Click the "Create New
            Document" button above.
          </Text>
        </Stack>
      ) : (
        <Stack gap="md">
          {documents.map((document) => (
            <Card key={document.id} withBorder padding="md" radius="md">
              <Group justify="space-between" wrap="nowrap">
                <Stack gap="xs">
                  <Text fw={500} size="lg">
                    {document.name}
                  </Text>
                  <Group gap="xs">
                    {document.project?.name && (
                      <Badge size="sm" variant="light">
                        {document.project.name}
                      </Badge>
                    )}
                    <Group gap="xs" c="dimmed" size="sm">
                      <RiCalendarLine size="1rem" />
                      <Text span size="sm">
                        Created {formatDate(document.created_at)}
                      </Text>
                      <RiTimeLine size="1rem" />
                      <Text span size="sm">
                        Updated {formatDate(document.updated_at)}
                      </Text>
                    </Group>
                  </Group>
                </Stack>
                <Menu shadow="md" position="bottom-end">
                  <Menu.Target>
                    <ActionIcon variant="subtle" color="gray">
                      <RiMoreLine size="1.2rem" />
                    </ActionIcon>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Item
                      leftSection={<RiEyeLine size="1rem" />}
                      component={Link}
                      to={`${document.id}`}
                    >
                      View
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<RiEditLine size="1rem" />}
                      component={Link}
                      to={`${document.id}/edit`}
                    >
                      Edit
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                      leftSection={<RiDeleteBinLine size="1rem" />}
                      color="red"
                      onClick={() => handleDeleteDocument(document.id)}
                    >
                      Delete
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </Card>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
