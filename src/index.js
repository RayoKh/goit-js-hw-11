import PixabayApi from './js/pixabay-api.js';
import { markupCreator } from './js/markup-creator.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  form: document.querySelector('form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const api = new PixabayApi();
refs.loadMoreBtn.style.display = 'none';

refs.form.addEventListener('submit', async e => {
  e.preventDefault();

  refs.gallery.innerHTML = '';
  refs.loadMoreBtn.style.display = 'none';

  api.searchQuery = refs.form.searchQuery.value.trim();
  if (!api.searchQuery) {
    refs.form.reset();
    return;
  }

  api.resetPage();
  try {
    const pics = await api.getPics();
    if (!pics.data.hits.length) throw new Error();

    const markup = await markupCreator(pics.data.hits);
    refs.gallery.insertAdjacentHTML('beforeend', markup);
    refs.loadMoreBtn.style.display = 'block';
  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
});

refs.loadMoreBtn.addEventListener('click', async () => {
  try {
    const pics = await api.getPics();

    const markup = await markupCreator(pics.data.hits);
    refs.gallery.insertAdjacentHTML('beforeend', markup);

    if (api.page > pics.data.totalHits / 40 + 1) {
      throw new Error();
    }
  } catch (error) {
    refs.loadMoreBtn.style.display = 'none';
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
});
