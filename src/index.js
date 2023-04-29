import axios from "axios";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import SimpleLightbox from "simplelightbox";
// import 'simplelightbox/dist/simple-lightbox.min.css';

Notify.init({
  width: '300px',
  position: 'right-bottom',
  closeButton: false,
});

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const moreBtn = document.querySelector('.load-more');

const LINK = 'https://pixabay.com/api/?';
const API_KEY = '35831610-a11fe96d6a1e2d9c789822419';
const IMAGE_PARAM = 'image_type=photo&orientation=horizontal&safesearch=true';
let currentPage = 1;
let quantityImage = 4;
let q = '';

searchForm.addEventListener('submit', handlerQuery);

function handlerQuery(e) {
  e.preventDefault();

  q = e.currentTarget.elements.searchQuery.value;
  const URL = `${LINK}key=${API_KEY}&q=${q}&${IMAGE_PARAM}&page=${currentPage}&per_page=${quantityImage}`;
  
  axiosGet(URL)

  moreBtn.addEventListener('click', onAddMoreImage); 
}

function onAddMoreImage() {
  currentPage +=1;
  const URL = `${LINK}key=${API_KEY}&q=${q}&${IMAGE_PARAM}&page=${currentPage}&per_page=${quantityImage}`;
  axiosGet(URL)
}

async function axiosGet(url) {
  return await axios(url)
    .then(resp => {
      if (resp.data.hits.length === 0) {
        gallery.innerHTML = '';
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        searchForm.reset();
        return
      }
      if (resp.data.totalHits < currentPage * quantityImage) {
        Notify.failure("We're sorry, but you've reached the end of search results");
        moreBtn.style.display = 'none';
      }
      gallery.insertAdjacentHTML('beforeend', markupGallery(resp.data.hits));
      moreBtn.style.display = 'block';  
    })
    .catch(err => Notify.failure(err.message));
  
}

function markupGallery(arr) {
    return arr
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) =>
    `<div class="photo-card gallery__item">
          <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
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
      )
      .join('');
}


