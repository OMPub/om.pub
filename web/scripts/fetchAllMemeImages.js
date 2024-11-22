
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const baseOutputFolder = path.join(__dirname, '..', 'public', 'meme-card-images');

async function downloadImage(url, filePath) {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

async function fetchCardInfo(cardId) {
  try {
    const response = await axios.get(
      "https://api.6529.io/api/nfts",
      {
        params: {
          id: cardId,
          contract: "0x33FD426905F149f8376e227d0C9D3340AaD17aF1",
        },
      }
    );
    return response.data.data[0];
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
}

async function extractAndDownloadImages() {
  let cardId = 1;
  let consecutiveFailures = 0;

  while (consecutiveFailures < 5) {
    try {
      const cardData = await fetchCardInfo(cardId.toString());
      if (!cardData) {
        consecutiveFailures++;
        cardId++;
        continue;
      }

      consecutiveFailures = 0;
      const cardName = cardData.name.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase();
      
      // Extract season from card data
      const seasonAttribute = cardData.metadata.attributes.find(attr => attr.trait_type === "Type - Season");
      const season = seasonAttribute ? seasonAttribute.value : "Unknown";
      
      // Create season subdirectory
      const seasonFolder = path.join(baseOutputFolder, `Season_${season}`);
      if (!fs.existsSync(seasonFolder)) {
        fs.mkdirSync(seasonFolder, { recursive: true });
      }

      const fileName = `${cardId}-${cardName}.png`;
      const filePath = path.join(seasonFolder, fileName);

      if (fs.existsSync(filePath)) {
        console.log(`Skipping existing file: ${fileName} in Season ${season}`);
      } else {
        await downloadImage(cardData.image, filePath);
        console.log(`Downloaded: ${fileName} to Season ${season}`);
      }

      cardId++;
    } catch (error) {
      console.error(`Error processing card ${cardId}:`, error.message);
      cardId++;
    }
  }
}

extractAndDownloadImages()
  .then(() => console.log('Image extraction and download complete!'))
  .catch(error => console.error('An error occurred:', error));

console.log('Script started');

console.log('Output folder:', baseOutputFolder);
