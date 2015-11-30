# autolink.js [![Build Status](https://img.shields.io/circleci/project/egoist/autolink.js/master.svg?style=flat-square)](https://circleci.com/gh/egoist/autolink.js/tree/master)

Auto-link url and images in text.

## Installation

```bash
npm install --save autolink.js
```

## Example

```javascript
import autoLink from 'autolink.js'
// link URL and Images
// normal link is transformed to <a>
// image address(png|gif|jpe?g) is transformed to <img>
autoLink(text)
// link URL only
// then it would regard image address as normal link using <a>
// instead of using <img> tag
autoLink(text, {image: false})
// link-ify and add DOM attributes
autoLink(text, {
  pattern: '[a-zA-Z0-9]',
  'data-lazyload': true
})
// show URL path only for normal links
// eg: 'http://github.com' is transformed to
// '<a href="http://github.com">github.com</a>'
// wow, without `http://` in the text
autoLink(text, {removeHTTP: true})
```

## License

MIT &copy; [EGOIST](https://github.com/egoist)
