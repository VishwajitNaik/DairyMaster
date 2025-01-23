const { Builder, By, Key, until } = require('selenium-webdriver');

async function testNextJsApp() {
  // Initialize the WebDriver (Chrome in this example)
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    // Open the Next.js application
    await driver.get('http://localhost:3000/home'); // Replace with your app's URL

    // Wait for a specific element to load (example: a button with id="test-button")
    await driver.wait(until.elementLocated(By.id('test-button')), 20000);

    // Click the button
    const button = await driver.findElement(By.id('test-button'));
    await button.click();

    // Assert some behavior, e.g., URL change or element visibility
    const resultElement = await driver.wait(until.elementLocated(By.id('result')), 5000);
    const resultText = await resultElement.getText();
    console.log('Result Text:', resultText);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Quit the browser session
    await driver.quit();
  }
}

testNextJsApp();
