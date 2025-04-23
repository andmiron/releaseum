import { useParams, Link } from "react-router-dom";
import {
  Title,
  Text,
  Stack,
  Group,
  LoadingOverlay,
  CopyButton,
  Anchor,
  ActionIcon,
  Tooltip,
  Paper,
  TypographyStylesProvider,
  Divider,
  Button,
} from "@mantine/core";
import { RiFileCopyLine, RiCheckLine, RiEditLine } from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import { DocumentsRepository } from "../../lib/repositories/documentsRepository";

export function DocumentPage() {
  const { projectSlug, documentId } = useParams();

  const {
    data: document,
    isPending: isDocumentLoading,
    isError: isDocumentError,
  } = useQuery({
    queryKey: ["document", documentId],
    queryFn: () => DocumentsRepository.getDocumentById(documentId),
    enabled: !!documentId,
  });

  const documentUrl = document
    ? `${projectSlug}.${window.location.host}/${document.id}`
    : "";

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
      {isDocumentLoading && <LoadingOverlay visible />}

      {document && (
        <>
          <Stack gap="xs">
            <Group justify="space-between" align="center">
              <Group justify="flex-start" align="center">
                <Link
                  to="/dashboard/projects"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Title fw={200}>Projects</Title>
                </Link>
                <Title fw={200}>&gt;</Title>
                <Link
                  to={`/dashboard/projects/${projectSlug}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Title fw={200}>{projectSlug}</Title>
                </Link>
                <Title fw={200}>&gt;</Title>
                <Title fw={200}>{document.title}</Title>
              </Group>
              <Button
                variant="light"
                component={Link}
                to="edit"
                leftSection={<RiEditLine size="1.2rem" />}
              >
                Edit Document
              </Button>
            </Group>

            <Group>
              <Text size="sm" c="dimmed">
                Share via:
              </Text>
              <Anchor
                href={`//${documentUrl}`}
                target="_blank"
                underline="hover"
                size="sm"
                c="blue"
              >
                {documentUrl}
              </Anchor>
              <CopyButton value={documentUrl} timeout={2000}>
                {({ copied, copy }) => (
                  <Tooltip
                    label={copied ? "Copied!" : "Copy URL"}
                    withArrow
                    position="right"
                  >
                    <ActionIcon
                      color={copied ? "teal" : "gray"}
                      variant="subtle"
                      onClick={copy}
                    >
                      {copied ? (
                        <RiCheckLine size="1.2rem" />
                      ) : (
                        <RiFileCopyLine size="1.2rem" />
                      )}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </Group>
          </Stack>

          <Divider />

          <TypographyStylesProvider>
            <div dangerouslySetInnerHTML={{ __html: document.content }} />
          </TypographyStylesProvider>
        </>
      )}
    </Stack>
  );
}
