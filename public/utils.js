import { errorPage } from '../pages/index.js';

export function setTitle (title) {
  document.title = title;
}
export function setCSS (name, rulesets) {
  const style = document.createElement('style');
  style.classList.add(`${name}-styles`);
  style.innerHTML = rulesets;
  document.head.append(style);
}
export function removeCSS (name) {
  const style = document.head.querySelector(`.${name}-styles`);

  style?.remove();
}

export async function setPage (pageOption) {
  const app = document.getElementById('app');

  if (typeof pageOption === 'string') {
    app.innerHTML = pageOption;
  } else {
    app.innerHTML = pageOption.loading;

    const res = await pageOption.onLoad();

    if (res.isReady) {
      app.innerHTML = pageOption.page(res.data);

      return { data: res.data };
    } else {
      removeCSS('header-sidebar-layout');
      errorPage(res.httpCode, res.message, res.data.page);

      return { isError: true };
    }
  }
}