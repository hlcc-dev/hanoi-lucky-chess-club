import { supabasePersistent } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";

export async function handleAuthCallback() {
    const navigate = useNavigate();
    const { data, error } = await supabasePersistent.auth.getSession();

    if (error) {
        console.error("Auth callback error:", error.message);
        return;
    }

    if (data.session) {
        // User is now VERIFIED 
        navigate("/");
    }
}