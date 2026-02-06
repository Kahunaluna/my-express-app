const form = document.getElementById("editForm");
const cancelBtn = document.getElementById("cancelBtn");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function checkAuth() {
    try {
        const res = await fetch("/api/auth/check");
        const data = await res.json();
        if (!data.authenticated) {
            alert("Please log in to edit games");
            window.location.href = "/login.html";
        }
    } catch (err) {
        console.error("Auth check failed:", err);
    }
}

async function loadGame() {
    const res = await fetch(`/api/games/${encodeURIComponent(id)}`);
    if (!res.ok) {
        alert("Error loading game");
        window.location.href = "/";
        return;
    }

    const game = await res.json();

    document.getElementById("gameName").value = game.gameName ?? "";
    document.getElementById("ranking").value = game.ranking ?? 1;
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const gameName = document.getElementById("gameName").value.trim();
    const ranking = Number(document.getElementById("ranking").value);

    const res = await fetch(`/api/games/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameName, ranking }),
    });

    if (!res.ok) {
        if (res.status === 401) {
            alert("Please log in to edit games");
            window.location.href = "/login.html";
            return;
        }
        alert("Error updating game");
        return;
    }
    
    window.location.href = "/";
});

cancelBtn.addEventListener("click", () => {
    window.location.href = "/";
});

checkAuth();
loadGame();