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
      email: isEmail("Invalid email"),
      name: hasLength({ max: 30 }, "Maximum of 30 characters long"),
      company: hasLength({ max: 30 }, "Maximum of 30 characters long"),
      password: hasLength({ min: 6 }, "At least 6 characters long"),
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
      navigate("/login");
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
            label="Email"
            placeholder="Your email"
            required
            {...registerForm.getInputProps("email")}
          />
          <TextInput
            label="Name"
            placeholder="Your name"
            description="Maximum of 30 characters long"
            mt="md"
            required
            {...registerForm.getInputProps("name")}
          />
          <TextInput
            label="Company"
            placeholder="Your company name"
            description="Maximum of 30 characters long"
            required
            mt="md"
            {...registerForm.getInputProps("company")}
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
