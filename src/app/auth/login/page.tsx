import LoginForm from "@/components/auth/LoginForm";
import { Metadata } from "next";
import { Suspense } from "react";

// Add dynamic configuration to prevent static optimization
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Log In | Trading Hub",
  description: "Log in to your Trading Hub account",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
