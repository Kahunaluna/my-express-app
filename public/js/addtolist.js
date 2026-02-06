const form = document.getElementById("entryForm");

async function checkAuth() {
    try {
        const res = await fetch("/api/auth/check");
        const data = await res.json();
        if (!data.authenticated) {
            alert("Please log in to add games");
            window.location.href = "/login.html";
        }
    } catch (err) {
        console.error("Auth check failed:", err);
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const gameName = document.getElementById("gameName").value.trim();
    const ranking = Number(document.getElementById("ranking").value);

    try {
        const response = await fetch("/api/games", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                gameName,
                ranking,
            }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
            alert(result.message);
            window.location.href = "/";
        } else if (response.status === 401) {
            alert("Please log in to add games");
            window.location.href = "/login.html";
        } else {
            alert("Error: " + result.error);
        }
    } catch (error) {
        console.error("Error adding game:", error);
        alert("Error adding game");
    }
});

checkAuth();
