import axios from 'axios';
const API_KEY = '32120806-a212a2c123eec8e05455b0236';
axios.defaults.baseURL = 'https://pixabay.com/api/';

export default class PixabayAPI {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  async FetchAPI() {
    const options = new URLSearchParams({
      key: API_KEY,
      page: this.page,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: 40,
    });
    const { data } = await axios(`?${options}`);
    this.page += 1;
    return data;
  }
  resetPage() {
    this.page = 1;
  }
  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
