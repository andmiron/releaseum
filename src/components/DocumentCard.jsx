import { Link } from "react-router-dom";
import {
  RiCalendarLine,
  RiEyeLine,
  RiEditLine,
  RiDeleteBinLine,
  RiMoreLine,
} from "react-icons/ri";
import { Menu, ActionIcon, Group, Text } from "@mantine/core";
import { formatDate } from "../utils/formatDate";

export function DocumentCard({ document, handleDeleteDocument }) {
  return (
    <Group justify="space-between" wrap="nowrap">
      <Group gap="xs">
        <Link
          to={`documents/${document.slug}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Text fw={500} size="lg">
            {document.title}
          </Text>
        </Link>
      </Group>

      <Group>
        <Group gap="xs" c="dimmed" size="sm">
          <RiCalendarLine size="1rem" />
          <Text span size="sm">
            Created {formatDate(document.created_at)}
          </Text>
        </Group>
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
              to={`documents/${document.slug}`}
            >
              View
            </Menu.Item>
            <Menu.Item
              leftSection={<RiEditLine size="1rem" />}
              component={Link}
              to={`documents/${document.slug}/edit`}
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
    </Group>
  );
}
