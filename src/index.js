import axios from "axios";
import Notiflix from 'notiflix';

const searchForm = document.querySelector('#search-form');
const queryInput = document.querySelector('.query');
const queryBtn = document.querySelector('.query-btn');

const LINK = 'https://pixabay.com/api/?';
const API_KEY = '35831610-a11fe96d6a1e2d9c789822419';
const IMAGE_PARAM = 'image_type=photo&orientation=horizontal&safesearch=true';


searchForm.addEventListener('submit', handlerQuery);

function handlerQuery(e) {
    e.preventDefault();

    const q = e.currentTarget.elements.searchQuery.value;
    const URL = `${LINK}key=${API_KEY}&q=${q}&${IMAGE_PARAM}`;
   
    axios.get(URL).then(resp => console.dir(resp.data));

    const cardGallery = `
    <div class="photo-card">
        <img src="" alt="" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
          </p>
          <p class="info-item">
            <b>Views</b>
          </p>
          <p class="info-item">
            <b>Comments</b>
          </p>
          <p class="info-item">
            <b>Downloads</b>
          </p>
        </div>
    </div>`;
    
}

