import axios from 'axios';

const fetchPebbleReps = async (seizer: string) => {
  try {
    const response = await axios.get('https://api.seize.io/api/profile-logs', {
      params: {
        page: 1,
        page_size: 100,
        include_incoming: true,
        rating_matter: 'REP',
        profile: seizer,
      },
    });
    const items = response.data.data;

    // Filter items based on 'new_rating' within 'contents'
    const validPebbles = items.filter(item => {
      const newRating = item.contents.new_rating;
      return newRating > 0 && newRating <= 100;
    });

    return validPebbles;
  } catch (error) {
    console.error('Error fetching pebble reps:', error);
    return [];
  }
};

export { fetchPebbleReps };
