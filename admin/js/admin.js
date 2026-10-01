import { supabase } from "./supabase.js";

const form = document.getElementById("login-form");
const message = document.getElementById("message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  message.textContent = "Loggin in..";

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    message.textContent = error.message;
    return;
  }

  async function checkUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) {
      return;
    }
    document.getElementById("user").textContent = `Logged in as: ${user.email}`;
  }
  checkUser();

  console.log("Logged in user: ", data.email);

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name", "role")
    .eq("id", user.id)
    .single();

  if (profileError) {
    message.textContent = error.message;
    return;
  }

  message.textContent = `Login success, hello ${profile}`;
});
