import axios from "axios";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';

Notify.init({
  width: '300px',
  position: 'right-top',
  closeButton: false,
});

const options = {};
const gallerySimple = new SimpleLightbox('.gallery__item a', options);

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const moreBtn = document.querySelector('.load-more');

const LINK = 'https://pixabay.com/api/?';
const API_KEY = '35831610-a11fe96d6a1e2d9c789822419';
const IMAGE_PARAM = 'image_type=photo&orientation=horizontal&safesearch=true';
let currentPage = 0;
let quantityImage = 40;
let q = '';

searchForm.addEventListener('submit', handlerQuery);

function handlerQuery(e) {
  e.preventDefault();

  gallery.innerHTML = '';
  currentPage = 1;

  q = e.currentTarget.elements.searchQuery.value;
  const URL = `${LINK}key=${API_KEY}&q=${q.trim()}&${IMAGE_PARAM}&page=${currentPage}&per_page=${quantityImage}`;
  
  axiosGet(URL);

  moreBtn.addEventListener('click', onAddMoreImage); 
}

function onAddMoreImage() {
  currentPage +=1;
  const URL = `${LINK}key=${API_KEY}&q=${q}&${IMAGE_PARAM}&page=${currentPage}&per_page=${quantityImage}`;
  axiosGet(URL);
  
}

async function axiosGet(url) {
  return await axios(url)
    .then(resp => {
      
      if (resp.data.hits.length === 0) {
        moreBtn.style.visibility = 'hidden';
        gallery.innerHTML = '';
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        searchForm.reset();
        return
      }

      gallery.insertAdjacentHTML('beforeend', markupGallery(resp.data.hits));
      Notify.success(`Hooray! We found ${resp.data.totalHits} images.`);
      scroll();
      moreBtn.style.visibility = 'visible';
      gallerySimple.refresh(); 
      
      if (resp.data.hits.length < quantityImage) {
         Notify.failure("We're sorry, but you've reached the end of search results");
        moreBtn.style.visibility = 'hidden';
      }    
    })
    .catch(err => {
      moreBtn.style.visibility = 'hidden'; 
      Notify.failure(err.message)
    });  
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
        <a href="${largeImageURL}">
          <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
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

function scroll() {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}