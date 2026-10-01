import { supabase } from "./supabase.js";

const status = document.getElementById("dashboard-status");
const signOutButton = document.getElementById("signout-button");

async function loadDashboard() {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    const user = data.session?.user;
    if (!user) {
      window.location.replace("login.html");
      return;
    }

    document.getElementById("header-email").textContent = user.email ?? "";
    document.getElementById("account-email").textContent =
      user.email ?? "Not available";

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      document.getElementById("account-name").textContent =
        user.email ?? "Not available";
      document.getElementById("account-role").textContent = "Unavailable";
      status.textContent =
        "Your account is signed in, but profile details could not be loaded.";
      return;
    }

    document.getElementById("account-name").textContent =
      profile?.full_name || user.email || "Not available";
    document.getElementById("account-role").textContent =
      profile?.role ?? "Not assigned";
    status.textContent = profile
      ? "Your session is active."
      : "Your session is active, but no profile is linked to this account.";
  } catch (error) {
    status.textContent =
      error instanceof Error
        ? `Unable to verify your session: ${error.message}`
        : "Unable to verify your session. Please try again.";
  }
}

signOutButton.addEventListener("click", async () => {
  signOutButton.disabled = true;
  status.textContent = "Signing out...";

  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }

    window.location.replace("login.html");
  } catch (error) {
    status.textContent =
      error instanceof Error
        ? error.message
        : "Unable to sign out. Please try again.";
    signOutButton.disabled = false;
  }
});

loadDashboard();
