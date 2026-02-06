document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const messageDiv = document.getElementById("message");

  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      messageDiv.textContent = data.message;
      messageDiv.style.color = "green";
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } else {
      messageDiv.textContent = data.error || "Registration failed";
      messageDiv.style.color = "red";
    }
  } catch (err) {
    console.error(err);
    messageDiv.textContent = "An error occurred. Please try again.";
    messageDiv.style.color = "red";
  }
});
