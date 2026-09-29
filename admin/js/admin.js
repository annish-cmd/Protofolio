import { supabase } from "./supabase.js";

const testBtn = document.getElementById("testBtn");
const status = document.getElementById("status");

testBtn.addEventListener("click", async () => {
  status.textContent = "Connecting...";
  const { data, error } = await supabase.from("test").select("*");

  if (error) {
    console.error(error);
    status.textContent = "Connection failed: " + error.message;
    return;
  }

  console.log(data);

  status.textContent = `Connection successful! Found ${data.length} products.`;
});
