const puppeteer = require("puppeteer");

const searchTerm = process.argv[2];

if (!searchTerm) {
  console.error("Please enter a search term");
  process.exit(1);
}

(async () => {
  console.clear();

  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch();
  console.log(`👌 Starting IMDB check for ${searchTerm}`);

  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto("https://www.google.com/");

  // Type into search box
  await page.type("textarea", `imdb ${searchTerm} parental guide`);
  await page.keyboard.press("Enter");

  // Wait and click on first result
  const searchResultSelector = "#search a:first-of-type";
  await page.waitForSelector(searchResultSelector);
  await page.click(searchResultSelector);

  console.log("⌛ Getting results...");

  // Locate the full title with a unique string
  const $profanity = await page.waitForSelector(
    "#advisory-profanity .ipl-status-pill"
  );
  const $profanityExample =
    (await page.waitForSelector(
      "#advisory-profanity .ipl-zebra-list li:nth-of-type(2)",
      { timeout: 5000 }
    )) || "null";

  const $nudity = await page.waitForSelector(
    "#advisory-nudity .ipl-status-pill"
  );
  const $nudityExample =
    (await page.waitForSelector(
      "#advisory-nudity .ipl-zebra-list li:nth-of-type(2)",
      { timeout: 5000 }
    )) || "null";

  const $violence = await page.waitForSelector(
    "#advisory-violence .ipl-status-pill"
  );
  const $violenceExample =
    (await page.waitForSelector(
      "#advisory-violence .ipl-zebra-list li:nth-of-type(2)",
      { timeout: 5000 }
    )) || "null";

  const $scary = await page.waitForSelector(
    "#advisory-frightening .ipl-status-pill"
  );
  const $scaryExample =
    (await page.waitForSelector(
      "#advisory-frightening .ipl-zebra-list li:nth-of-type(2)",
      { timeout: 5000 }
    )) || "null";

  let results = [];

  const profanity = await $profanity?.evaluate((el) => el.textContent);
  const profanityExample = $profanityExample
    ? await $profanityExample?.evaluate((el) => {
        var e = el.querySelectorAll("div");
        for (var i = 0; i < e.length; i++) e[i].parentNode.removeChild(e[i]);

        return el.textContent.trim();
      })
    : "No examples found";

  const nudity = await $nudity?.evaluate((el) => el.textContent);
  const nudityExample = $nudityExample
    ? await $nudityExample?.evaluate((el) => {
        var e = el.querySelectorAll("div");
        for (var i = 0; i < e.length; i++) e[i].parentNode.removeChild(e[i]);

        return el.textContent.trim();
      })
    : "No examples found";

  const violence = await $violence?.evaluate((el) => el.textContent);
  const violenceExample = $violenceExample
    ? await $violenceExample?.evaluate((el) => {
        var e = el.querySelectorAll("div");
        for (var i = 0; i < e.length; i++) e[i].parentNode.removeChild(e[i]);

        return el.textContent.trim();
      })
    : "No examples found";

  const scary = await $scary?.evaluate((el) => el.textContent);
  const scaryExample = $scaryExample
    ? await $scaryExample?.evaluate((el) => {
        var e = el.querySelectorAll("div");
        for (var i = 0; i < e.length; i++) e[i].parentNode.removeChild(e[i]);

        return el.textContent.trim();
      })
    : "No examples found";

  console.log("");
  console.log("🤬 Profanity: ", profanity);
  console.log("👉 Eg: ", profanityExample);
  console.log("");

  console.log("🍆 Nudity: ", nudity);
  console.log("👉 Eg: ", nudityExample);
  console.log("");

  console.log("🔫 Violence: ", violence);
  console.log("👉 Eg: ", violenceExample);
  console.log("");

  console.log("👻 Scary: ", scary);
  console.log("👉 Eg: ", scaryExample);
  console.log("");

  console.log("✅ Check complete");

  await browser.close();
})();
