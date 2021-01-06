import { BASE_URL, DATA_URL_ATTRIBUTE } from './constants';

export interface GradSubLink {
    text: string;
    url: string;
    displayName?: string;
}

export interface GradLink extends GradSubLink {
    externalURL?: string;
    subLinks?: GradSubLink[];
}

export const links: GradLink[] = [
    {
        text: 'Home',
        url: '/home'
    },
    {
        text: 'Über uns',
        url: '/ueber-uns',
        subLinks: [
            {
                text: 'Miteinander',
                url: '/miteinander'
            },
            {
                text: 'Struktur',
                url: '/struktur'
            },
            {
                text: 'Historie',
                url: '/historie'
            }
        ]
    },
    {
        text: 'Technik',
        url: '/technik',
        subLinks: [
            {
                text: 'Server',
                url: '/server'
            },
            {
                text: 'Missionsbau',
                url: '/missionsbau'
            },
            {
                text: 'Modding',
                url: '/modding'
            }
        ]
    },
    {
        text: 'Mitspielen',
        url: '/mitspielen',
        subLinks: [
            {
                text: 'Mitspielen',
                url: '/allgemeines'
            },
            {
                text: 'Checkliste',
                url: '/checkliste'
            }
        ]
    },
    {
        text: 'Kontakt',
        url: '/kontakt'
    },
    {
        text: 'Forum',
        url: '/forum',
        externalURL: 'https://forum.gruppe-adler.de'
    },
    {
        text: 'Wiki',
        url: '/wiki',
        externalURL: 'https://wiki.gruppe-adler.de'
    },
    {
        displayName: 'International',
        text: '<svg aria-label="International" style="height: 1em;" viewBox="0 0 64 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 0V32H64V0H0Z" fill="#00247D"/><path d="M64 0L0 32M0 0L64 32L0 0Z" stroke="white" stroke-width="6.4"/><path d="M26.3852 20L0.477051 32.9541M37.5 12L63.5 -1.00003M42.5 20L64.5 31M-0.477051 0.954056L21.5358 12" stroke="#CF142B" stroke-width="2.135"/><path d="M0 16H64M32 0V32V0Z" stroke="white" stroke-width="10.6667"/><path d="M0 16H64M32 0V32V0Z" stroke="#CF142B" stroke-width="6.4"/></svg>',
        url: '/en'
    }
];

/**
 * Render sub-link
 * @param {GradLink} link parent link
 * @param {GradSubLink} subLink Sub-link to render
 * @returns {string} rendered HTML
 */
export function renderSubLink(link: GradLink, subLink: GradSubLink): string {
    const url = link.externalURL || BASE_URL + link.url;

    return `<li><a class="grad-nav__link" href="${url + subLink.url}" ${DATA_URL_ATTRIBUTE}="${link.url + subLink.url}">${subLink.text}</a></li>`;
}

/**
 * Render link
 * @param {GradLink} link Link to render
 * @returns {string} rendered HTML
 */
export function renderLink (link: GradLink): string {
    const url = link.externalURL || BASE_URL + link.url;

    let subLinkText = '';
    if (link.subLinks !== undefined) {
        subLinkText += '<ul class="grad-nav__sub-links grad-nav--only-large">';
        subLinkText += link.subLinks.map(subLink => renderSubLink(link, subLink)).join('\n');
        subLinkText += '</ul>';
    }

    return `
    <li class="grad-nav__link-wrapper">
        <a class="grad-nav__link" href="${url}" ${DATA_URL_ATTRIBUTE}="${link.url}">${link.text}</a>
        ${subLinkText}
    </li>
    `;
}
