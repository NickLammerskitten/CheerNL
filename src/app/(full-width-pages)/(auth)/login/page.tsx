import { Metadata } from "next";
import LoginForm from "../../../../components/auth/LoginForm";

export const metadata: Metadata = {
    title: "Cheer Next Level Login",
    description: "Das ist die Login Seite für die software CheerNL",
};

export default function Login() {
    return <LoginForm />;
}
