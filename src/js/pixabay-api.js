import axios from 'axios';

const API_KEY = '49374949-4ded30d1f71c5277e2f481102';
const BASE_URL = 'https://pixabay.com/api/';

let currentPage = 1;
const perPage = 15;

export function resetPage() {
  currentPage = 1;
}

export function incrementPage() {
  currentPage += 1;
}

export async function fetchImages(query) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: currentPage,
    per_page: perPage,
  };

  try {
    const response = await axios.get(BASE_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Fetch images error:', error.message);
    throw error;
  }
}
