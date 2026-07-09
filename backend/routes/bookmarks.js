const express = require("express");
const Bookmark = require("../models/Bookmark");
const Internship = require("../models/Internship");

const router = express.Router();

/**
 * POST /api/bookmarks
 * body: { internshipId, userId }
 */
router.post("/", async (req, res) => {
  try {
    const { internshipId, userId } = req.body;

    if (!internshipId || !userId) {
      return res
        .status(400)
        .json({ error: "internshipId and userId are required" });
    }

    // Check internship exists
    const internship = await Internship.findById(internshipId);

    if (!internship) {
      return res.status(404).json({ error: "Internship not found" });
    }

    // Prevent duplicates
    const existing = await Bookmark.findOne({
      internshipId,
      userId,
    });

    if (existing) {
      return res.status(409).json({
        error: "Already bookmarked",
      });
    }

    const bookmark = await Bookmark.create({
      internshipId,
      userId,
    });

    res.status(201).json(bookmark);
  } catch (err) {
    console.error("[POST /api/bookmarks]", err);
    res.status(500).json({
      error: "Failed to save bookmark",
    });
  }
});

/**
 * DELETE /api/bookmarks/:internshipId?userId=demo-user
 */
router.delete("/:internshipId", async (req, res) => {
  try {
    const { internshipId } = req.params;
    const { userId } = req.query;

    await Bookmark.findOneAndDelete({
      internshipId,
      userId,
    });

    res.json({
      message: "Bookmark removed",
    });
  } catch (err) {
    console.error("[DELETE /api/bookmarks]", err);
    res.status(500).json({
      error: "Failed to remove bookmark",
    });
  }
});

/**
 * GET /api/bookmarks?userId=demo-user
 */
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        error: "userId is required",
      });
    }

    const bookmarks = await Bookmark.find({
      userId,
    }).populate("internshipId");

    res.json(bookmarks);
  } catch (err) {
    console.error("[GET /api/bookmarks]", err);
    res.status(500).json({
      error: "Failed to fetch bookmarks",
    });
  }
});

module.exports = router;