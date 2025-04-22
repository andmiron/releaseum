import {
  Anchor,
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useTimeout } from "@mantine/hooks";
import { useForm, isEmail, hasLength } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

export function RegisterPage() {
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const navigate = useNavigate();

  const registerForm = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
      name: "",
      company: "",
      confirmPassword: "",
    },
    validate: {
      name: hasLength({ min: 2, max: 30 }, "Name must be 2-30 characters long"),
      company: hasLength(
        { min: 2, max: 30 },
        "Company name must be 2-30 characters long"
      ),
      email: isEmail("Invalid email"),
      password: hasLength(
        { min: 6 },
        "Password must have at least 6 characters"
      ),
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords do not match" : null,
    },
  });

  const handleSubmitRegister = async (values) => {
    try {
      await register(
        values.email,
        values.password,
        values.name,
        values.company
      );

      notifications.show({
        title: "Welcome!",
        message: "You have successfully created an account.",
        color: "green",
      });

      await new Promise((resolve) => setTimeout(resolve, 200));
      navigate("/dashboard");
    } catch (err) {
      notifications.show({
        title: "Register failed!",
        message: err.message,
        color: "red",
      });
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" style={{ fontWeight: "200" }}>
        Create an account
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{" "}
        <Anchor size="sm" component={Link} to="/login">
          Login
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={registerForm.onSubmit(handleSubmitRegister)}>
          <TextInput
            label="Name"
            placeholder="Your name"
            description="Name is max 30 characters long"
            required
            {...registerForm.getInputProps("name")}
          />
          <TextInput
            label="Company"
            placeholder="Your company name"
            description="Company name is max 30 characters long"
            required
            mt="md"
            {...registerForm.getInputProps("company")}
          />
          <TextInput
            label="Email"
            placeholder="john@doe.com"
            required
            mt="md"
            {...registerForm.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            description="Password must have at least 6 characters"
            required
            mt="md"
            {...registerForm.getInputProps("password")}
          />
          <PasswordInput
            label="Confirm password"
            placeholder="Confirm your password"
            required
            mt="md"
            {...registerForm.getInputProps("confirmPassword")}
          />
          <Button fullWidth mt="xl" type="submit" loading={isLoading}>
            Sign up
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
