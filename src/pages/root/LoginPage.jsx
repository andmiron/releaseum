import {
  Anchor,
  Button,
  Container,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, isEmail, hasLength } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const navigate = useNavigate();

  const loginForm = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: isEmail("Invalid email"),
      password: hasLength(
        { min: 6 },
        "Password must have at least 6 characters"
      ),
    },
  });

  const handleSubmitLogin = async (values) => {
    try {
      await login(values.email, values.password);

      notifications.show({
        title: "Login successful!",
        message: "Welcome back!",
      });

      navigate("/dashboard");
    } catch (err) {
      notifications.show({
        title: "Login failed!",
        message: err.message,
        color: "red",
      });
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" style={{ fontWeight: "200" }}>
        Welcome back!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{" "}
        <Anchor size="sm" component={Link} to="/register">
          Create account
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={loginForm.onSubmit(handleSubmitLogin)}>
          <TextInput
            label="Email"
            placeholder="you@mantine.dev"
            required
            {...loginForm.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            {...loginForm.getInputProps("password")}
          />
          <Button fullWidth mt="xl" type="submit" loading={isLoading}>
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
