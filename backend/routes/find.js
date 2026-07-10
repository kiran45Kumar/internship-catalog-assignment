const express = require("express");
const groq = require("../lib/groq");
const Internship = require("../models/Internship");
const buildPrompt = require("../prompts/recommendPrompt");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { skills, interests, location, workMode } = req.body;

    if (!skills || !interests) {
      return res.status(400).json({
        error: "Skills and interests are required.",
      });
    }

    const skillList = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const interestList = interests
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);

    const keywords = [...skillList, ...interestList];

    const filter = {
      $or: [
        {
          skills: {
            $in: skillList,
          },
        },
        {
          title: {
            $regex: keywords.join("|"),
            $options: "i",
          },
        },
        {
          domain: {
            $regex: keywords.join("|"),
            $options: "i",
          },
        },
        {
          description: {
            $regex: keywords.join("|"),
            $options: "i",
          },
        },
        ...(location
          ? [
              {
                location: {
                  $regex: location,
                  $options: "i",
                },
              },
            ]
          : []),
        ...(workMode
          ? [
              {
                workMode: {
                  $regex: workMode,
                  $options: "i",
                },
              },
            ]
          : []),
      ],
    };

    let internships = await Internship.find(filter).limit(20)

    if (internships.length < 5) {
      const technicalDomains = [
        "Software",
        "AI/ML",
        "Data",
        "Cloud",
        "Cyber Security",
        "DevOps",
        "Backend",
        "Frontend",
        "Full Stack",
      ];

      const extra = await Internship.find({
        _id: {
          $nin: internships.map((i) => i._id),
        },
        domain: {
          $in: technicalDomains,
        },
      }).limit(10 - internships.length);

      internships = [...internships, ...extra];

      internships = [...internships, ...extra];
    }

    const prompt = buildPrompt(
      {
        skills,
        interests,
        location,
        workMode,
      },
      internships,
    );

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      response_format: {
        type: "json_object",
      },
      messages: [
        {
          role: "system",
          content: `
You are an API.

Return ONLY valid JSON.

Never return markdown.
Never return explanations.
Never think aloud.

Return this format only:

{
  "internships":[
    {
      "id":"...",
      "reason":"..."
    }
  ]
}
`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const response = completion.choices[0].message.content;

    let parsed;

    try {
      parsed = JSON.parse(response);
    } catch (err) {
      console.log(response);

      return res.status(500).json({
        error: "Invalid JSON returned by AI.",
      });
    }

    const recommendations = Array.isArray(parsed)
      ? parsed
      : parsed.internships || parsed.recommendations || [];

    const results = recommendations
      .map((item) => {
        const internship = internships.find(
          (i) => i._id.toString() === item.id,
        );

        if (!internship) return null;

        return {
          ...internship.toObject(),
          reason: item.reason,
        };
      })
      .filter(Boolean);

    res.json(results);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to generate recommendations.",
    });
  }
});

module.exports = router;
