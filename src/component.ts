import { DATA_URL_ATTRIBUTE, SMALL_BREAKPOINT } from './constants';
import { type GradLink, type GradSubLink, links, renderSubLink } from './links';
import GradPathChangedEvent from './PathChangedEvent';
import template from './template';

export default class GradNavbar extends HTMLElement {
    private _small = false;
    private _expanded = false;
    private _subLinksHidden = false;
    private _activePath = '';

    constructor () {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // add expand / collapse button click listener
        const btn = this.shadowRoot.querySelector('nav > button');
        if (btn !== null) btn.addEventListener('click', () => { this.expanded = !this.expanded; });

        // add nav link click EHs to all elements which have a DATA_URL_ATTRIBUTE
        this.shadowRoot.querySelectorAll(`[${DATA_URL_ATTRIBUTE}]`).forEach(this.addNavLinkEH, this);

        const navEl = this.shadowRoot.querySelector('nav');
        if (navEl !== null) {
            // This resize observer is used to update the small attribute
            const resizeObserver = new ResizeObserver(entries => {
                if (entries.length === 0) return;

                const entry = entries[0];

                if (entry.borderBoxSize === undefined || entry.borderBoxSize.length === 0) return;

                this.small = entry.borderBoxSize[0].inlineSize < SMALL_BREAKPOINT;
            });
            resizeObserver.observe(navEl);

            // This mutation observer is used to automatically add a click EH to all
            // added elements which have an DATA_URL_ATTRIBUTE
            const mutationObserver = new MutationObserver(entries => {
                for (const { addedNodes } of entries) {
                    addedNodes.forEach(node => {
                        if (node.nodeType !== Node.ELEMENT_NODE) return;

                        const el = node as Element;

                        if (el.getAttribute(DATA_URL_ATTRIBUTE) !== null) {
                            this.addNavLinkEH(el);
                        }

                        el.querySelectorAll(`[${DATA_URL_ATTRIBUTE}]`).forEach(this.addNavLinkEH, this);
                    });
                }
            });
            mutationObserver.observe(navEl, { childList: true, subtree: true });
        }
    }

    /**
     * The connectedCallback() runs each time the element is added to the DOM.
     */
    connectedCallback (): void {
        this.render();

        window.requestAnimationFrame(() => {
            const navEl = this.shadowRoot.querySelector('nav');
            if (navEl === null) return;

            const { width } = navEl.getBoundingClientRect();

            this.small = width < SMALL_BREAKPOINT;
        });
    }

    static get observedAttributes (): string[] {
        return ['sublinks-hidden', 'active-path', 'nav-style'];
    }

    /**
     * Invoked each time one of the custom element's attributes is added, removed, or changed. Which attributes to notice change for is specified in a static get observedAttributes method
     * @param name Attribute name
     * @param oldValue Old attribute value
     * @param newValue New attribute value
     */
    attributeChangedCallback (name: string, oldValue: string | null, newValue: string | null): void {
        if (oldValue === newValue) return;

        switch (name) {
            case 'sublinks-hidden':
                this.subLinksHidden = newValue !== null;
                break;
            case 'active-path':
                this.changePath(newValue === null ? '' : newValue);
                break;
            case 'nav-style':
                {
                    const navEl = this.shadowRoot.querySelector('nav');

                    if (navEl === null) break;

                    if (newValue === null) {
                        navEl.removeAttribute('style');
                    } else {
                        navEl.setAttribute('style', newValue);
                    }
                }
                break;
        }
    }

    private get small (): boolean { return this._small; }
    private set small (val: boolean) {
        if (val === this._small) return;
        this._small = val;

        this.toggleRootClass('grad-nav--small', val);
    }

    private get expanded (): boolean { return this._expanded; }
    private set expanded (val: boolean) {
        if (val === this._expanded) return;
        this._expanded = val;

        this.toggleRootClass('grad-nav--open', val);
    }

    private get subLinksHidden (): boolean { return this._subLinksHidden; }
    private set subLinksHidden (val: boolean) {
        if (val === this._subLinksHidden) return;
        this._subLinksHidden = val;

        this.toggleRootClass('grad-nav--sub-links-hidden', val);
    }

    private get activePath (): string { return this._activePath; }

    /**
     * Change active path.
     * @param val New path
     * @returns If change path event was canceled
     */
    private changePath (val: string): boolean {
        this._activePath = val;

        this.setAttribute('active-path', val);

        this.render();

        const { link, subLink } = this.getActiveLinkAndSubLink();

        const l = subLink || link;
        const displayName = l.displayName || l.text;

        return !this.dispatchEvent(new GradPathChangedEvent(val, displayName));
    }

    /**
     * Toggle class name on root element
     * @param className CSS class
     * @param enabled Whether class is added or removed
     */
    private toggleRootClass (className: string, enabled: boolean) {
        const navEl = this.shadowRoot.querySelector('nav');
        if (navEl === null) return;

        if (enabled) {
            navEl.classList.add(className);
        } else {
            navEl.classList.remove(className);
        }
    }

    /**
     * Get active GradLink and GradSubLink according to current
     * activePath attribute.
     */
    private getActiveLinkAndSubLink (): { link: GradLink, subLink: GradSubLink | null } {
        const url = `/${this.activePath.split('/')[1]}`;
        const subURL = this.activePath.replace(new RegExp(`^${url}`, 'i'), '');

        const link = links.find(l => l.url === url) || { text: '', url: '' };
        return { link, subLink: (link.subLinks || []).find(l => l.url === subURL) || null };
    }

    /**
     * Prevents sublinks to clip outside the right window border
     */
    private fixSubLinksOffset () {
        // find all sub link containers
        const subLinkContainers: HTMLDivElement[] = Array.from(this.shadowRoot.querySelectorAll('.grad-nav__link-wrapper > .grad-nav__sub-links'));

        // get the right edge of the sub-link bar
        const subLinkBar: HTMLDivElement = this.shadowRoot.querySelector('.grad-nav__sub-link-bar');
        if (!subLinkBar) return;
        const paddingRight = Number.parseInt(window.getComputedStyle(subLinkBar).getPropertyValue('padding-right'), 10);
        const maxRight = subLinkBar.getBoundingClientRect().right - paddingRight;

        for (const elem of subLinkContainers) {
            const right = elem.getBoundingClientRect().right;

            if (right > maxRight) {
                // apply negative left offset to prevent clipping
                elem.style.left = `${maxRight - right}px`;
            }
        }
    }

    /**
     * Render navbar
     */
    private render () {
        const { link, subLink } = this.getActiveLinkAndSubLink();

        // add sub-links to bar for display mode small
        if (link.subLinks !== undefined) {
            const html = link.subLinks.map(sub => renderSubLink(link, sub)).join('\n');

            this.shadowRoot.querySelector('.grad-nav__sub-link-bar > .grad-nav__sub-links').innerHTML = html;
        } else {
            this.shadowRoot.querySelector('.grad-nav__sub-link-bar > .grad-nav__sub-links').innerHTML = '';
        }

        // update texts
        this.shadowRoot.querySelector('.grad-nav__sub-link-bar > span').innerHTML = subLink !== null ? subLink.text : link.text;
        this.shadowRoot.querySelector('.grad-nav > h1').innerHTML = link.text;

        // Update css classes of all .grad-nav__link elements
        this.shadowRoot.querySelectorAll('.grad-nav__link').forEach(el => {
            const url = el.getAttribute(DATA_URL_ATTRIBUTE);

            if (url === null) return;

            if (this.activePath.includes(url)) {
                el.classList.add('grad-nav--active');
            } else {
                el.classList.remove('grad-nav--active');
            }
        });

        document.fonts.ready.then(() => {
            window.requestAnimationFrame(() => { this.fixSubLinksOffset(); });
        });
    }

    /**
     * Add onNavClick method as click event handler
     * @param element Element to event handler to
     */
    private addNavLinkEH (element: Element) {
        element.addEventListener('click', this.onNavLinkClick.bind(this));
    }

    /**
     * Event handler for clicking on link
     * @param event Event
     */
    private onNavLinkClick (event: MouseEvent) {
        const elements = event.composedPath() as HTMLElement[];

        let url: string | null = null;

        for (const el of elements) {
            const elURL = el.getAttribute(DATA_URL_ATTRIBUTE);

            if (elURL === null) continue;

            url = elURL;
            break;
        }

        if (url === null) return;

        this.expanded = false;

        const cancelled = this.changePath(url);

        if (cancelled) event.preventDefault();
    }
}
