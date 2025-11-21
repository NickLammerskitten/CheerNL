import { Metadata } from "next";
import LoginForm from "../../../../components/auth/LoginForm";

export const metadata: Metadata = {
    title: "CLE Login | CheerNL",
    description: "Das ist die Login Seite für die software CheerNL",
};

export default function Login() {
    return <LoginForm />;
}
