import { useRouter } from "next/navigation";

const useGoBack = () => {
    const router = useRouter();

    return () => {
        if (window.history.length > 1) {
            router.back(); // Navigate to the previous route
        } else {
            router.push("/dashboard"); // Redirect to home if no history exists
        }
    };
};

export default useGoBack;
