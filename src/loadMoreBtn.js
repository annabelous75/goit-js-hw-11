export default class LoadMoreBtn {
  constructor(className, onLoadBTNclick) {
    document.body.insertAdjacentHTML(
      'beforeend',
      `<button type="button" class="${className}">Load more</button>`
    );
    this.loadmorebtnref = document.querySelector(`.${className}`);
    this.loadmorebtnref.addEventListener('click', onLoadBTNclick);
    this.hide();
  }
  hide() {
    this.loadmorebtnref.style.display = 'none';
  }
  show() {
    this.loadmorebtnref.style.display = 'block';
  }
  loading() {
    this.loadmorebtnref.textContent = 'Loading...';
  }
  endloading() {
    this.loadmorebtnref.textContent = 'Load more';
  }
}
