import { toast } from "react-toastify";
import { getActiveClient } from "./getActiveClient";
import i18n from "../i18n/config";

export async function checkUsernameAvailable(username: string): Promise<boolean> {
    const supabaseClient = await getActiveClient();
    const { data, error } = await supabaseClient
        .from("profiles")
        .select("username")
        .eq("username", username)
        .maybeSingle();

    if (error) {
        toast.error(i18n.t("errors.usernameCheckFailed", { message: error.message }));
        return false;
    }

    if (data) {
        toast.error(i18n.t("errors.usernameUnavailable"));
        return false;
    }

    return true;
}