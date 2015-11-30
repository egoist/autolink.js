(function () {
  function AutoLink (string, options) {
    options = options || {}
    this.string = string
    this.options = options
    this.attrs = ''
    for (var key in this.options) {
      if (key && key !== 'image' && key !== 'removeHTTP') {
        this.attrs += (' ' + key + '="' + this.options[key] + '"')
      }
    }
  }

  AutoLink.prototype = {
    constructor: AutoLink,
    parse: function () {
      var shouldReplaceImage = defaultTrue(this.options.image)
      var urlWithImageRe = new RegExp('(\\s?)((http|https|ftp)://([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-_]*)*\/?)', 'gim')
      if (!shouldReplaceImage) {
        return this.string.replace(urlWithImageRe, this.formatURLMatch.bind(this))
      } else {
        return this.string.replace(urlWithImageRe, this.formatIMGMatch.bind(this))
      }
    },
    formatURLMatch: function (match, p1) {
      match = match.trim()
      var text = this.options.removeHTTP ? removeHTTP(match) : match
      return p1 + '<a href="' + prepHTTP(match) + '"' + this.attrs + '>' + text + '</a>'

    },
    formatIMGMatch: function (match, p1) {
      match = match.trim()
      var imgRe = /\.(jpe?g|png|gif)$/
      var isIMG = imgRe.test(match)
      if (isIMG) {
        return p1 + '<img src="' + prepHTTP(match.trim()) + '"' + this.attrs + '/>'
      }
      return this.formatURLMatch(match, p1)
    }
  }

  function defaultTrue (val) {
    return (typeof val === 'undefined') ? true : val
  }

  function prepHTTP (url) {
    if (url.substring(0, 4) !== 'http' && url.substring(0, 2) !== '//') {
      return 'http://' + url
    }
    return url
  }

  function removeHTTP (url) {
    return url.replace(/.*?:\/\//g, '')
  }

  function autoLink (string, options) {
    return new AutoLink(string, options).parse()
  }

  if (typeof module !== 'undefined') {
    module.exports = autoLink
  } else if (typeof window !== 'undefined') {
    window.autoLink = autoLink
  }
})();
