import ResetPassword from "@/app/(dashboard)/profile/components/reset-password";
import ComponentCard from "@/components/common/ComponentCard";

export default async function ProfilePage() {

    return (
        <ComponentCard title={"Profil"}>
            <ResetPassword />
        </ComponentCard>
    )
}