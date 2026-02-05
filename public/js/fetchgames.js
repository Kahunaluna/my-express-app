const gamesList = document.getElementById("gamesList");
const statusDisplay = document.getElementById("status");

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
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.type = "button";

            const editBtn = document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.type = "button";

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

            li.textContent = `${game.gameName} (Ranking: ${game.ranking}/10) | `;
            li.appendChild(editBtn);
            li.appendChild(deleteBtn);
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
        statusDisplay.textContent = "Delete failed";
        return;
    }

    statusDisplay.textContent = "Game deleted";
}

loadGames();