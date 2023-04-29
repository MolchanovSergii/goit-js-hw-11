import axios from "axios";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

Notify.init({
  width: '300px',
  position: 'right-bottom',
  closeButton: false,
});

const searchForm = document.querySelector('#search-form');
const queryInput = document.querySelector('.query');
const queryBtn = document.querySelector('.query-btn');
const gallery = document.querySelector('.gallery');

const LINK = 'https://pixabay.com/api/?';
const API_KEY = '35831610-a11fe96d6a1e2d9c789822419';
const IMAGE_PARAM = 'image_type=photo&orientation=horizontal&safesearch=true';
let currentPage = 1;

searchForm.addEventListener('submit', handlerQuery);

function handlerQuery(e) {
    e.preventDefault();

    let q = e.currentTarget.elements.searchQuery.value;
    const URL = `${LINK}key=${API_KEY}&q=${q}&${IMAGE_PARAM}&$page=${currentPage}&per_page=40`;

    axios
      .get(URL)
      .then(resp => resp.data.hits)
      .then(data => {
        if (data.length === 0) {
          Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
          searchForm.reset();
        }
        gallery.insertAdjacentHTML('beforeend', markupGallery(data));
      });

}



function markupGallery(arr) {
    return arr.map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes: ${likes}</b>
          </p>
          <p class="info-item">
            <b>Views: ${views}</b>
          </p>
          <p class="info-item">
            <b>Comments: ${comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads: ${downloads}</b>
          </p>
        </div>
    </div>`
    ).join('');
        

}

