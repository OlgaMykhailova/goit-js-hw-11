import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
import cards from './templates/cards.hbs';

const API_KEY = '29440507-0f03869f45aa2c40ea01c2d83';
const BASE_URL = 'https://pixabay.com';

const formEl = document.querySelector('.search-form');
const inputEl = document.querySelector('input');
const galleryEl = document.querySelector('.gallery');
const loadMoreEl = document.querySelector('.load-more');

let page = 1;

formEl.addEventListener('submit', onSearch);
loadMoreEl.addEventListener('click', onLoadMore);

async function fetchData(page) {
  const searchValue = inputEl.value;
  try {
    const response = await axios.get(
      `${BASE_URL}/api/?key=${API_KEY}&q=${searchValue}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    );
    return response;
  } catch (error) {
    console.error(error.message);
  }
}

function renderMarkup(data) {
  const markup = cards(data.data.hits);

  if (data.data.hits.length === 0) {
    Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  } else {
    const totalHits = data.data.totalHits;
    Notify.success(`Hooray! We found ${totalHits} images.`);
    galleryEl.insertAdjacentHTML('beforeend', markup);
    const lightbox = new SimpleLightbox('.gallery a', {
      captionDelay: 250,
      captionsData: 'alt',
      captionPosition: 'bottom',
    });
    lightbox.refresh();
  }
}

async function onSearch(event) {
  event.preventDefault();
  page = 1;
  galleryEl.innerHTML = '';
  const data = await fetchData(page);
  renderMarkup(data);
  }

async function onLoadMore() {
  page += 1;
  const data = await fetchData(page);
  renderMarkup(data);
  }
