import styles from './assets/styles.scss';
import adlerkopp from './assets/adlerkopp.svg';
import { links, renderLink } from './links';
import { DATA_URL_ATTRIBUTE } from './constants';

const template = document.createElement('template');

template.innerHTML = `
    <style>${styles}</style>
    <nav class="grad-nav">
        <img src="${adlerkopp}" alt="adlerkopp" style="cursor: pointer;" aria-hidden="true" height="48" width="48" ${DATA_URL_ATTRIBUTE}="/home" />
        <h1 class="grad-nav--only-small grad-nav--only-closed" style="font-weight: initial; margin: 0;"></h1>
        <div class="grad-nav__header grad-nav--only-large">
            <h1>Gruppe Adler</h1>
            <h2 style="opacity: .5;">Deutscher Arma 3 Coop & TvT Clan</h2>
        </div>
        <button class="grad-nav__menu-btn grad-nav--only-small">
            <svg aria-label="Navigations-Menü schließen" class="grad-nav--only-opened" width="28" height="28" viewBox="0 0 28 28">
                <rect fill="currentColor" width="28" height="2" x="0" y="13" transform="rotate(45,14,14)"></rect>
                <rect fill="currentColor" width="28" height="2" x="0" y="13" transform="rotate(-45,14,14)"></rect>
            </svg>
            <svg aria-label="Navigations-Menü öffnen" class="grad-nav--only-closed" width="28" height="28" viewBox="0 0 28 28">
                <rect fill="currentColor" width="28" height="2" x="0" y="3"></rect>
                <rect fill="currentColor" width="28" height="2" x="0" y="13"></rect>
                <rect fill="currentColor" width="28" height="2" x="0" y="23"></rect>
            </svg>
        </button>
        <ul class="grad-nav__links">
            ${links.map(renderLink).join('\n')}
        </ul>
        <div class="grad-nav__sub-link-bar">
            <ul class="grad-nav__sub-links grad-nav--only-small" style="margin-left: auto;"></ul>
            <span class="grad-nav--only-large" style="height: 2.75rem; line-height: 2.75rem;"></span>
        </div>
    </nav>
`;

export default template;
