const fs = require('fs');
const path = require('path');
const subsPath = path.join(__dirname, '../alternateGPU.json');
const availableGPUsPath = path.join(__dirname, '../availableGPUs.json');
const BASE_URL = 'https://www.alternate.nl/NVIDIA/GeForce-RTX-';

const scrapeGPUs = async (page) => {
  const data = fs.readFileSync(subsPath);
  let subs = JSON.parse(data) || [];

  // find all cards that are subbed
  // see if any are updated
  // send updates to channels that are subbed

  const models = [...new Set(subs.map((sub) => sub['card_name']))];

  console.log(models);

  for (let i = 0; i < models.length; i++) {
    const url = BASE_URL + models[i];
    await page.goto(url);
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    try {
      const products = await page.waitForSelector('.productBox', {
        visible: true,
      });
      // console.log(products);
    } catch (e) {
      console.log('oh no');
    }

    const scrapedData = await page.evaluate(() => {
      const gpus = document.querySelectorAll('.productBox');

      const arr = Array.from(gpus)
        .filter(
          (g) =>
            g.querySelector('.delivery-info > span').innerHTML ===
            'Direct leverbaar'
        )
        .map((g) => {
          return {
            href: g.href,
            name: g.querySelector('.product-name').innerText,
          };
        });

      return arr;
    });

    // send to the appropriate server channel
    if (scrapedData.length > 0) console.log(scrapedData);

    // check if the data has already been recorded, if not, notify in the channel
    // and add to json file

    if (newData(scrapedData)) {
      // loop through the channels which have subbed to the model
      // send them a message
      // update the old data
    }
  }
};

// return any new data
const newData = (scrapedData) => {
  const data = fs.readFileSync(availableGPUsPath);
  let recordedOffers = JSON.parse(data) || [];

  const result = scrapedData.filter(({ href: id1 }) =>
    recordedOffers.some(({ href: id2 }) => id2 !== id1)
  );

  return result ? result : null;
};

module.exports = {
  scrapeGPUs,
};
