const express = require("express");
const Game = require("../models/Game");

const router = express.Router();

router.get("/api/games", async (req, res) => {
	try {
		const games = await Game.find().sort({ ranking: 1 });
		res.json(games);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Error fetching games" });
	}
});

router.get("/api/games/:id", async (req, res) => {
	try {
		const game = await Game.findById(req.params.id);
		if (!game) {
			return res.status(404).json({ error: "Game not found" });
		}
		res.json(game);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Error fetching game" });
	}
});

router.post("/api/games", async (req, res) => {
	try {
		const { gameName, ranking } = req.body;

		const newGame = new Game({
			gameName,
			ranking,
		});

		await newGame.save();
		res.json({ success: true, message: "Game added successfully!", game: newGame });
	} catch (err) {
		console.error(err);
		res.status(400).json({ error: "Error adding game" });
	}
});

router.put("/api/games/:id", async (req, res) => {
	try {
		const { gameName, ranking } = req.body;
		const updatedGame = await Game.findByIdAndUpdate(
			req.params.id,
			{ gameName, ranking },
			{ new: true, runValidators: true }
		);

		if (!updatedGame) {
			return res.status(404).json({ error: "Game not found" });
		}

		res.json({ success: true, message: "Game updated successfully!", game: updatedGame });
	} catch (err) {
		console.error(err);
		res.status(400).json({ error: "Error updating game" });
	}
});

router.delete("/api/games/:id", async (req, res) => {
	try {
		const deletedGame = await Game.findByIdAndDelete(req.params.id);
		if (!deletedGame) {
			return res.status(404).json({ error: "Game not found" });
		}
		res.json({ success: true, message: "Game deleted successfully!" });
	} catch (err) {
		console.error(err);
		res.status(400).json({ error: "Error deleting game" });
	}
});

module.exports = router;
