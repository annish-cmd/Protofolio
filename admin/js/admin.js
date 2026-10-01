import { supabase } from "./supabase.js";

const form = document.getElementById("login-form");
const message = document.getElementById("message");
const submitButton = form.querySelector('button[type="submit"]');

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  submitButton.disabled = true;
  message.textContent = "Signing in...";

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      message.textContent = error.message;
      return;
    }

    const user = data.user;
    if (!user) {
      message.textContent =
        "Sign-in did not return a user session. Please try again.";
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      message.textContent = profileError.message;
      return;
    }

    if (!profile) {
      message.textContent = `No administrator profile exists for ${user.email}.`;
      return;
    }

    window.location.assign("dashboard.html");
  } catch (error) {
    message.textContent =
      error instanceof Error
        ? error.message
        : "Unable to sign in right now. Please try again.";
  } finally {
    submitButton.disabled = false;
  }
});
