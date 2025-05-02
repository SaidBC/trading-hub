import LoginForm from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In | Trading Hub",
  description: "Log in to your Trading Hub account",
};

export default function LoginPage() {
  return <LoginForm />;
}
