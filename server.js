require("dotenv").config();
const PORT = process.env.PORT || 3000;
const openaiApiKey = process.env.OPENAI_API_KEY;
const fetch = require("node-fetch");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const helmet = require("helmet");
const compression = require("compression");

app.use(bodyParser.json());
app.use(express.static(__dirname + "/"));
app.use(helmet());
app.use(compression());

app.use(function (req, res, next) {
  res.status(404).send("Sorry, that route does not exist.");
});

// Error handling middleware - Keep this as the last use() call
app.use(function (err, req, res) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.post("/find-trip", async (req, res) => {
  try {
    const findTrip = req.body;

    const getMessage = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `Provide one day trip itinerarin in ${findTrip.trip}. Make sure the content is concise and words are in a reasonable limits. The example and format is provided as follows:
            "Morning:
            • Start with a breakfast at a café in The Rocks, a historic area with a view of the Harbour Bridge.
            • Take a guided tour of the Sydney Opera House to learn about its iconic design and cultural significance.
            • Stroll around Circular Quay, and enjoy the street performers and view the Museum of Contemporary Art.
  
            Midday:
            • Have lunch at one of the restaurants overlooking Sydney Harbour.
            • Catch a ferry to Taronga Zoo from Circular Quay for a unique view of the Sydney skyline and see native Australian animals.
  
            Afternoon:
            • Return to the city and visit the Royal Botanic Garden to relax and enjoy the greenery.
            • Walk from the gardens to the Art Gallery of New South Wales to see Australian, Aboriginal, and European art.
  
            Evening:
            • Have dinner at Darling Harbour, which is bustling with a variety of eateries.
            • Explore the nightlife in the area, or opt for a scenic dinner cruise on the harbour to end your night.
  
            Tips:
            • Check for any events or festivals happening on the day of your visit.
            • Use public transport or a hop-on-hop-off Sydney bus tour to easily move between sights.
            • Wear comfortable shoes as there’s a lot of walking involved.
            • Book tickets for attractions online in advance to avoid queues."
            `,
            },
          ],
          max_tokens: 800,
          temperature: 1,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const jsonRes = await getMessage.json();
    res.send(jsonRes);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while processing your request.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
