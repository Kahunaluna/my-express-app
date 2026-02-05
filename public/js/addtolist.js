const form = document.getElementById("entryForm");

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

        if (result.success) {
            alert(result.message);
            window.location.href = "/";
        } else {
            alert("Error: " + result.error);
        }
    } catch (error) {
        console.error("Error adding game:", error);
        alert("Error adding game");
    }
});
