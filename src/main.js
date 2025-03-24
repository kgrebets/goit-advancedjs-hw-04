import { fetchImages, resetPage, incrementPage } from './js/pixabay-api.js';
import { renderImages, clearGallery } from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/styles.css';

const form = document.querySelector('.form');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more');

let currentQuery = '';
let totalHits = 0;
let loadedImages = 0;

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

form.addEventListener('submit', async e => {
  e.preventDefault();

  const query = e.target.elements.searchQuery.value.trim();
  if (!query) {
    return iziToast.error({
      message: 'Please enter a search query!',
      position: 'topLeft',
    });
  }

  if (query !== currentQuery) {
    resetPage();
    clearGallery();
    loadMoreBtn.classList.add('hidden');
    currentQuery = query;
    loadedImages = 0;
  }

  await handleImageRequest();
  form.reset();
});

loadMoreBtn.addEventListener('click', async () => {
  incrementPage();
  await handleImageRequest(true);
});

async function handleImageRequest(isLoadMore = false) {
  toggleLoader(true);
  try {
    const data = await fetchImages(currentQuery);
    toggleLoader(false);

    if (data.hits.length === 0 && loadedImages === 0) {
      loadMoreBtn.classList.add('hidden');

      return iziToast.warning({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topLeft',
      });
    }

    renderImages(data.hits);
    lightbox.refresh();
    loadedImages += data.hits.length;
    totalHits = data.totalHits;

    if (loadedImages < totalHits) {
      loadMoreBtn.classList.remove('hidden');
    } else {
      loadMoreBtn.classList.add('hidden');
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topLeft',
      });
    }

    if (isLoadMore) smoothScroll();
  } catch (error) {
    toggleLoader(false);
    iziToast.error({
      message: 'An error occurred. Please try again.',
      position: 'topLeft',
    });
  }
}

function toggleLoader(show) {
  loader.classList.toggle('hidden', !show);
  loadMoreBtn.classList.toggle('hidden', show);
}

function smoothScroll() {
  const firstCard = document.querySelector('.gallery-item');
  if (firstCard) {
    const cardHeight = firstCard.getBoundingClientRect().height;
    window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });
  }
}
