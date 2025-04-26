import { useParams } from "react-router-dom";
import {
  Stack,
  Title,
  Text,
  AppShell,
  Group,
  Container,
  LoadingOverlay,
  TypographyStylesProvider,
  Anchor,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { DocumentsRepository } from "../../lib/repositories/documentsRepository";

export function PublicDocumentPage({ projectSlug }) {
  const { documentId } = useParams();

  const {
    data: document,
    isPending: isDocumentLoading,
    isError: isDocumentError,
  } = useQuery({
    queryKey: ["public-document", projectSlug, documentId],
    queryFn: () =>
      DocumentsRepository.getDocumentByProjectSlugAndDocumentId(
        projectSlug,
        documentId
      ),
    enabled: !!projectSlug && !!documentId,
  });

  if (isDocumentError) {
    return (
      <Stack align="center" gap="md" py={50}>
        <Text size="lg" c="red">
          Error loading document
        </Text>
        <Text c="dimmed" ta="center" maw={400}>
          The document you're looking for might have been moved or deleted.
        </Text>
      </Stack>
    );
  }

  return (
    <AppShell header={{ height: 60 }} footer={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md" justify="center">
          <Title order={3} fw={500}>
            {document?.title || "Loading..."}
          </Title>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="lg">
          {isDocumentLoading && <LoadingOverlay visible />}

          {document && (
            <TypographyStylesProvider>
              <div dangerouslySetInnerHTML={{ __html: document.content }} />
            </TypographyStylesProvider>
          )}
        </Container>
      </AppShell.Main>

      <AppShell.Footer p="md">
        <Container size="lg">
          <Group justify="center">
            <Text size="sm" c="dimmed">
              Powered by{" "}
              <Anchor
                href="https://releaseum.com"
                target="_blank"
                underline="hover"
              >
                Releaseum
              </Anchor>
            </Text>
          </Group>
        </Container>
      </AppShell.Footer>
    </AppShell>
  );
}
