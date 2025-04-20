import { UnstyledButton, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export function Logout() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      notifications.show({
        title: "Logout successful!",
        message: "You have been logged out",
      });
      navigate("/");
    } catch (err) {
      notifications.show({
        title: "Logout failed!",
        message: err.message,
        color: "red",
      });
    }
  };

  return (
    <UnstyledButton onClick={handleLogout}>
      <Text>Logout</Text>
    </UnstyledButton>
  );
}
