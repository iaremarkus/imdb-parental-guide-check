import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

type TCheckResult = { status: any; example: any } | undefined;

export async function POST(request: Request) {
  const res = await request.json();
  let url: string;

  const options = { timeout: 3000 };
  const { search } = res;

  console.log("search", search);

  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: "new" });
  console.log(`👌 Starting IMDB check for ${search}`);

  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto("https://www.google.com/");

  // Type into search box
  await page.type("textarea", `imdb ${search} parental guide`);
  await page.keyboard.press("Enter");

  // Wait and click on first result
  const searchResultSelector = "#search a:first-of-type";
  await page.waitForSelector(searchResultSelector);
  await page.click(searchResultSelector);

  console.log("⌛ Getting results...");

  url = page.url();

  let profanityData: TCheckResult = {
    status: null,
    example: null
  };
  let nudityData: TCheckResult = {
    status: null,
    example: null
  };
  let violenceData: TCheckResult = {
    status: null,
    example: null
  };
  let scaryData: TCheckResult = {
    status: null,
    example: null
  };

  try {
    profanityData.status = await page.waitForSelector("#advisory-profanity .ipl-status-pill");
    profanityData.example = await page.waitForSelector(
      "#advisory-profanity .ipl-zebra-list li:nth-of-type(2)",
      options
    );
  } catch {}

  try {
    nudityData.status = await page.waitForSelector("#advisory-nudity .ipl-status-pill");
    nudityData.example = await page.waitForSelector("#advisory-nudity .ipl-zebra-list li:nth-of-type(2)", options);
  } catch {}

  try {
    violenceData.status = await page.waitForSelector("#advisory-violence .ipl-status-pill");
    violenceData.example = await page.waitForSelector("#advisory-violence .ipl-zebra-list li:nth-of-type(2)", options);
  } catch {}

  try {
    scaryData.status = await page.waitForSelector("#advisory-frightening .ipl-status-pill");
    scaryData.example = await page.waitForSelector("#advisory-frightening .ipl-zebra-list li:nth-of-type(2)", options);
  } catch {}

  const profanity = (await profanityData.status?.evaluate((el: any) => el.textContent)) || "No data found";
  const profanityExample = profanityData.example
    ? await profanityData.example?.evaluate((el: any) => {
        var e = el.querySelectorAll("div");
        for (var i = 0; i < e.length; i++) e[i].parentNode.removeChild(e[i]);

        return el.textContent.trim();
      })
    : "No examples found";

  const nudity = (await nudityData.status.evaluate((el: any) => el.textContent)) || "No data found";
  const nudityExample = nudityData.example
    ? await nudityData.example?.evaluate((el: any) => {
        var e = el.querySelectorAll("div");
        for (var i = 0; i < e.length; i++) e[i].parentNode.removeChild(e[i]);

        return el.textContent.trim();
      })
    : "No examples found";

  const violence = (await violenceData.status?.evaluate((el: any) => el.textContent)) || "No data found";
  const violenceExample = violenceData.example
    ? await violenceData.example?.evaluate((el: any) => {
        var e = el.querySelectorAll("div");
        for (var i = 0; i < e.length; i++) e[i].parentNode.removeChild(e[i]);

        return el.textContent.trim();
      })
    : "No examples found";

  const scary = (await scaryData.status?.evaluate((el: any) => el.textContent)) || "No data found";
  const scaryExample = scaryData.example
    ? await scaryData.example?.evaluate((el: any) => {
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

  return NextResponse.json({
    url,
    results: [
      {
        type: "profanity",
        value: profanity,
        example: profanityExample
      },
      {
        type: "nudity",
        value: nudity,
        example: nudityExample
      },
      {
        type: "violence",
        value: violence,
        example: violenceExample
      },
      {
        type: "scary",
        value: scary,
        example: scaryExample
      }
    ]
  });
}
