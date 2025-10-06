
const SUPABASE_URL = "https://zmfmlfzbllgfylsfpsnq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptZm1sZnpibGxnZnlsc2Zwc25xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NDQ3NzUsImV4cCI6MjA3NTMyMDc3NX0.uFzAyQl2v2DocuZY3a34cz_Uv-5El8vvdi5a-HK160Y";

const { createClient } = window.supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const form = document.getElementById("loginForm");
const notification = document.getElementById("notification");

function showNotification(message, type = "success", duration = 3000) {
  notification.textContent = message;
  notification.className = "notification";
  if (type === "error") notification.classList.add("error");
  notification.style.display = "block";
  setTimeout(() => {
    notification.style.display = "none";
  }, duration);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .eq("password", password);

  if (error) {
    showNotification("Error connecting to server", "error", 3000);
    return;
  }

  if (users && users.length > 0) {
    showNotification("Login successful! Ensure you complete the welcome bonus task to enjoy.", "success", 5000);
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 5000);
  } else {
    showNotification("Wrong details, kindly cross check it.", "error", 3000);
    setTimeout(() => {
      window.location.href = "login.html";
    }, 3000);
  }
});
