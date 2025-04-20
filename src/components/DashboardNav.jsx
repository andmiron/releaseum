import { NavLink, Stack } from "@mantine/core";
import { Link, useLocation } from "react-router-dom";
import {
  RiDashboardLine,
  RiProjectorLine,
  RiFileList3Line,
  RiUser3Line,
  RiLogoutBoxLine,
} from "react-icons/ri";
import { useAuthStore } from "../store/authStore";

export function DashboardNav() {
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);

  const navItems = [
    {
      label: "Overview",
      to: "/dashboard",
      icon: RiDashboardLine,
    },
    {
      label: "Projects",
      to: "/dashboard/projects",
      icon: RiProjectorLine,
    },
    {
      label: "Documents",
      to: "/dashboard/documents",
      icon: RiFileList3Line,
    },
    {
      label: "Profile",
      to: "/dashboard/profile",
      icon: RiUser3Line,
    },
  ];

  return (
    <Stack justify="space-between" h="100%">
      <Stack gap="xs">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            component={Link}
            to={item.to}
            label={item.label}
            leftSection={<item.icon size="1.3rem" stroke={1.5} />}
            active={location.pathname === item.to}
            variant="light"
          />
        ))}
      </Stack>

      <NavLink
        onClick={logout}
        label="Logout"
        leftSection={<RiLogoutBoxLine size="1.3rem" stroke={1.5} />}
        variant="light"
        color="red"
        style={{ marginTop: "auto" }}
      />
    </Stack>
  );
}
