const gamesList = document.getElementById("gamesList");
const statusDisplay = document.getElementById("status");
let isAuthenticated = false;

async function checkAuth() {
    try {
        const res = await fetch("/api/auth/check");
        const data = await res.json();
        isAuthenticated = data.authenticated;
        updateAuthUI(data);
    } catch (err) {
        console.error("Auth check failed:", err);
        isAuthenticated = false;
    }
}

function updateAuthUI(authData) {
    const authButtons = document.getElementById("authButtons");
    const manageLinks = document.getElementById("manageLinks");
    
    if (!authButtons) return;

    if (authData.authenticated) {
        authButtons.innerHTML = `
            <span>Welcome, ${authData.user.username}!</span>
            <button id="logoutBtn" class="btn">Logout</button>
        `;
        
        document.getElementById("logoutBtn").addEventListener("click", async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.reload();
        });

        if (manageLinks) {
            manageLinks.style.display = "block";
        }
    } else {
        authButtons.innerHTML = `
            <a href="/login.html" class="btn">Login</a>
            <a href="/register.html" class="btn">Register</a>
        `;

        if (manageLinks) {
            manageLinks.style.display = "none";
        }
    }
}

async function loadGames() {
    gamesList.innerHTML = "";
    statusDisplay.textContent = "Loading games...";

    try {
        const res = await fetch("/api/games");
        if (!res.ok) {
            statusDisplay.textContent = "Failed to load games";
            return;
        }

        const games = await res.json();

        if (games.length === 0) {
            statusDisplay.textContent = "No games yet";
            return;
        }

        games.forEach((game) => {
            const li = document.createElement("li");
            li.textContent = `${game.gameName} (Ranking: ${game.ranking}/10)`;

            if (isAuthenticated) {
                const editBtn = document.createElement("button");
                editBtn.textContent = "Edit";
                editBtn.type = "button";

                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Delete";
                deleteBtn.type = "button";

                deleteBtn.addEventListener("click", async () => {
                    if (!confirm(`Delete ${game.gameName}?`)) {
                        return;
                    }
                    await deleteGame(game._id);
                    loadGames();
                });

                editBtn.addEventListener("click", () => {
                    window.location.href = `/edit.html?id=${encodeURIComponent(game._id)}`;
                });

                li.appendChild(document.createTextNode(" | "));
                li.appendChild(editBtn);
                li.appendChild(deleteBtn);
            }

            gamesList.appendChild(li);
        });

        statusDisplay.textContent = `Loaded ${games.length} games.`;
    } catch (err) {
        statusDisplay.textContent = "Failed to load games";
    }
}

async function deleteGame(id) {
    statusDisplay.textContent = "Deleting...";

    const res = await fetch(`/api/games/${id}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        if (res.status === 401) {
            alert("Please log in to delete games");
            window.location.href = "/login.html";
            return;
        }
        statusDisplay.textContent = "Delete failed";
        return;
    }

    statusDisplay.textContent = "Game deleted";
}

async function init() {
    await checkAuth();
    await loadGames();
}

init();