const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");

const app = express();
const PORT = 2000;

app.use(express.json());

app.get("/recipe/:item", (req, res) => {
    generateImage(req.params.item).then(succeeded => {
        if (succeeded != 0) res.status(404).send("No recipe found");
        else res.sendFile(path.join(__dirname, "current.jpg"));
    });
});

async function generateImage(itemName) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = `https://minecraft.fandom.com/wiki/${itemName}`;

    await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });

    await page.goto(url, {waitUntil: "domcontentloaded"});
    
    const table = await page.$("span[class='mcui mcui-Crafting_Table pixel-image']");

    if (table == null) return -1;

    await table.screenshot({ path: 'current.jpg' });

    await browser.close();

    return 0;
}


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
