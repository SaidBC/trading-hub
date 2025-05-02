import SignupForm from "@/components/auth/SignupForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Trading Hub",
  description: "Create a new account on Trading Hub",
};

export default function SignupPage() {
  return <SignupForm />;
}
