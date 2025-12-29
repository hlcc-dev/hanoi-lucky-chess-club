import { toast } from "react-toastify";
import { getActiveClient } from "./getActiveClient";

export async function checkUsernameAvailable(username: string): Promise<boolean> {
    const supabaseClient = await getActiveClient();
    const { data, error } = await supabaseClient
        .from("profiles")
        .select("username")
        .eq("username", username)
        .maybeSingle();

    if (error) {
        toast.error(`Error checking username availability: ${error.message}`);
        return false;
    }

    if (data) {
        toast.error("Username is not available. Please choose another one.");
        return false;
    }

    return true;
}