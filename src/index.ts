import assert from "node:assert";
import { Builder, Browser, WebDriver, By, until } from "selenium-webdriver";

async function login(driver: WebDriver) {
  const startTime = Date.now();
  await driver.get("https://www.automationexercise.com/");
  console.log("Page Title:", await driver.getTitle());

  const loginBtn = await driver.findElement(By.linkText("Signup / Login"));
  await loginBtn.click();

  const emailText = await driver.wait(
    until.elementLocated(By.css("input[data-qa='login-email']")),
    10000,
  );
  await emailText.clear();
  await emailText.sendKeys("dextra@gmail.com");

  const passText = await driver.findElement(
    By.css("input[data-qa='login-password']"),
  );
  await passText.clear();
  await passText.sendKeys("user1");

  const loginEnter = await driver.findElement(
    By.css("button[data-qa='login-button']"),
  );
  await loginEnter.click();

  const durationInSeconds = (Date.now() - startTime) / 1000;
  console.log(`Login execution time: ${durationInSeconds}s`);
}

async function dataScrapping(driver: WebDriver) {
  const logoutLink = await driver.wait(
    until.elementLocated(By.xpath("//a[@href='/logout']")),
    10000,
  );
  assert.ok(await logoutLink.isDisplayed(), "Link Logout tidak tampil!");

  const currentUrl = await driver.getCurrentUrl();
  assert.strictEqual(
    currentUrl,
    "https://www.automationexercise.com/",
    "Page tidak berpindah ke halaman utama",
  );

  const products = await driver.findElements(By.css(".single-products"));
  assert.ok(products.length > 0, "Daftar produk tidak ditemukan!");

  let counter = 1;
  for (const product of products.slice(0, 10)) {
    const price = await product.findElement(By.css(".productinfo h2"));
    const name = await product.findElement(By.css(".productinfo p"));

    console.log(
      `Product ${counter}: ${await name.getText()} - ${await price.getText()}`,
    );
    counter++;
  }
}

async function main() {
  const driver = await new Builder().forBrowser(Browser.CHROME).build();

  try {
    await login(driver);
    await dataScrapping(driver);
    console.log(
      "\n[RESULT] TEST PASSED: Login sukses, Link terverifikasi, dan data produk tampil.",
    );
  } catch (err) {
    console.error("\n[RESULT] TEST FAILED:", err);
  } finally {
  }
}

main().catch(console.error);
