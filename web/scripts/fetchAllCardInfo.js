const fs = require('fs');
const axios = require('axios');

async function fetchCardInfo(cardId) {
  try {
    const response = await axios.get(
      "https://api.seize.io/api/nfts",
      {
        params: {
          id: cardId,
          contract: "0x33FD426905F149f8376e227d0C9D3340AaD17aF1",
        },
      }
    );
    return response.data.data[0];
  } catch (error) {
    console.error(`Error fetching card info for card ${cardId}:`, error);
    return null;
  }
}

async function fetchAllCards() {
  const cards = {};
  for (let i = 1; i <= 155; i++) {
    const cardInfo = await fetchCardInfo(i.toString());
    cards[i] = cardInfo;
    console.log(`Fetched info for card ${i}`);
  }
  fs.writeFileSync('./public/cardInfo.json', JSON.stringify(cards, null, 2));
  console.log('All card info fetched and saved to cardInfo.json');
}

fetchAllCards();
