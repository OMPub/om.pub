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
    const vaildReps = items.filter((item: { contents: { new_rating: number }, created_at: number, target_profile_handle: string }) => {
      const newRating = item.contents.new_rating;
      const timestamp = new Date(item.created_at).getTime()/1000;
      return (newRating > 0 && newRating <= 100) 
        && (timestamp > 1709067758 && timestamp < 1709154000)
        && item.target_profile_handle === seizer;
    });
    return vaildReps;
  } catch (error) {
    console.error('Error fetching pebble reps:', error);
    return [];
  }
};

export { fetchPebbleReps };
