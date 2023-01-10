import puppeteer from "puppeteer";
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// scraper
const fetchSwipes = async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    headless: true,
  });

  const page = await browser.newPage();

  await page.goto("https://www.jumbocash.net/login.php?cid=233&");
  await page.waitForSelector("#loginphrase");
  await page.type("#loginphrase", process.env.TUFTS_ID);
  await page.type("#password", process.env.TUFTS_PASSWORD);
  await page.click('input[type="submit"]');
  await page.waitForSelector(".jsa_transactions");

  const swipes = await page.evaluate(
    () => document.querySelector("table:last-of-type tbody .sr-only").innerText
  );

  const swipesLeft = parseInt(swipes.replace("Current Balance", "").trim());
  console.log(`swipes left: ${swipesLeft}`);

  await page.close();
  await browser.close();

  return swipesLeft;
}

// routes
app.get('/', (req, res) => {
  res.json({ message: 'simple backend to fetch meal swipes & jumbocash!' });
});

app.get("/swipes", async (req, res) => {
  try {
    const swipesLeft = await fetchSwipes();
    const dateNow = new Date();
    res.json({ 
      id: process.env.TUFTS_ID,
      swipesLeft: swipesLeft,
      dateChecked: dateNow.toString()
    });
  } catch (error) {
    res.json({ error: "couldn't fetch meal swipes..." });
  }
});

// start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
