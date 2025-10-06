const SUPABASE_URL = "https://zmfmlfzbllgfylsfpsnq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptZm1sZnpibGxnZnlsc2Zwc25xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NDQ3NzUsImV4cCI6MjA3NTMyMDc3NX0.uFzAyQl2v2DocuZY3a34cz_Uv-5El8vvdi5a-HK160Y";

const { createClient } = window.supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullName = document.getElementById("fullname").value.trim();
  const username = document.getElementById("username").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();
  const referralCode = document.getElementById("referralCode").value.trim();

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  // Fetch user's IP
  const ip = await fetch("https://api.ipify.org?format=json")
    .then((res) => res.json())
    .then((data) => data.ip)
    .catch(() => "Unknown");

  // Check if IP already exists (only one account per device)
  const { data: existingIP } = await supabase
    .from("users")
    .select("*")
    .eq("ip_address", ip);

  if (existingIP && existingIP.length > 0) {
    alert("You already have an account on this device!");
    return;
  }

  // If referral code is entered, check if username exists
  let referredBy = null;
  if (referralCode) {
    const { data: refUser } = await supabase
      .from("users")
      .select("*")
      .eq("username", referralCode);

    if (!refUser || refUser.length === 0) {
      alert("Invalid referral code. Please check and try again.");
      return;
    } else {
      referredBy = referralCode;
      document.getElementById("referralStatus").textContent = `You were referred by: ${referralCode}`;
    }
  }

  // Save data to Supabase
  const { error } = await supabase.from("users").insert([
    {
      full_name: fullName,
      username,
      phone,
      email,
      password,
      referral_code: referredBy,
      ip_address: ip,
    },
  ]);

  if (error) {
    alert("Error registering user: " + error.message);
  } else {
    alert("Account created successfully!");
    document.getElementById("registerForm").reset();
  }
});