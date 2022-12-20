import './css/styles.css';
import Notiflix from 'notiflix';
const axios = require('axios').default;
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PixabayAPI from './fetchphotos';
import LoadMoreBtn from './loadMoreBtn';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadbtn: document.querySelector('.load-more'),
  searchbtn: document.querySelector('.search-button'),
};
const API_KEY = '32120806 - a212a2c123eec8e05455b0236';

refs.form.addEventListener('submit', onFormSubmit);

const pictureAPI = new PixabayAPI();
const loadMoreBtn = new LoadMoreBtn('load-more', onLoadmoreBTNclick);
const simplelightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  captionsData: 'alt',
  doubleTapZoom: 2,
  enableKeyboard: true,
});

async function onFormSubmit(evt) {
  refs.gallery.innerHTML = '';
  evt.preventDefault();
  pictureAPI.query = evt.target.elements.searchQuery.value.trim();
  if (pictureAPI.query === '') {
    Notiflix.Notify.warning('Please, enter something');
    return;
  }
  pictureAPI.resetPage();

  try {
    const { hits, totalHits } = await pictureAPI.FetchAPI();
    if (hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      refs.gallery.innerHTML = '';
      loadMoreBtn.hide();
      return;
    }
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    renderPictures(hits);
    simplelightbox.refresh();
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
    loadMoreBtn.show();
  } catch (error) {
    Notiflix.Notify.failure('Something happened wrong');
  }
}

function renderPictures(images) {
  const markupPhotos = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
            <a href="${largeImageURL}">
              <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            </a>
            <div class="info">
              <p class="info-item">
                <b>Likes: </b>${likes}
              </p>
              <p class="info-item">
                <b>Views: </b>${views}
              </p>
              <p class="info-item">
                <b>Comments: </b>${comments}
              </p>
              <p class="info-item">
                <b>Downloads: </b>${downloads}
              </p>
            </div>
          </div>`;
      }
    )
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markupPhotos);
}
async function onLoadmoreBTNclick() {
  loadMoreBtn.loading();
  const data = pictureAPI.FetchAPI();
  try {
    const { hits, totalHits } = await pictureAPI.FetchAPI();
    renderPictures(hits);
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
    loadMoreBtn.show();
    loadMoreBtn.endloading();

    if (hits.length < 40) {
      loadMoreBtn.hide();
      Notiflix.Notify.info(
        `We're sorry, but you've reached the end of search results.`
      );
    }
  } catch (error) {
    Notiflix.Notify.failure('Something happened wrong');
  }
}
