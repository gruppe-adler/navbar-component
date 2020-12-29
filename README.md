# Gruppe Adler Navbar Web Component

Gruppe Adler navbar Web Component.

## NPM
This component can be found on [npm](https://www.npmjs.com/package/@gruppe-adler/navbar-component).

## Usage
### Register component
```js
import { GradNavbar } from '@gruppe-adler/navbar-component';

customElements.define('grad-navbar', GradNavbar);
```

### Attributes
- `sublinks-hidden`: If present the sub link bar will be hidden
- `active-path`: Path to show as active
- `nav-style`: Will be copied into style attribute of root nav element of component

### Events
The navbar emits a `gradpathchanged` event, which includes two properties:
- `gradPath`: A string containing the active path 
- `gradDisplayName`: A string containing the displayName of the link

## Contributing
Project is a simple Typescript, Webpack setup.

### NPM scrips
- `npm run serve`: Start development server on port 3000
- `npm run lint`: Run eslint
- `npm run build`: Build for production