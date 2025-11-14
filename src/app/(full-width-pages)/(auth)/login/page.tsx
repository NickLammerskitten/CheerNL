import { Metadata } from "next";
import LoginForm from "../../../../components/auth/LoginForm";

export const metadata: Metadata = {
    title: "Next.js SignIn Page | TailAdmin - Next.js Dashboard Template",
    description: "This is Next.js Signin Page TailAdmin Dashboard Template",
};

export default function Login() {
    return <LoginForm />;
}
