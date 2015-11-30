(function () {
  function Autolink (string, options) {
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

  Autolink.prototype = {
    constructor: Autolink,
    parse: function () {
      var shouldReplaceImage = defaultTrue(this.options.image)
      var urlWithImageRe = new RegExp('(\\s?)((http|https|ftp)://([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-_]*)*\/?)', 'gim')
      if (!shouldReplaceImage) {
        return this.string.replace(urlWithImageRe, this.formatURLMatch.bind(this))
      } else {
        return this.string.replace(urlWithImageRe, this.formatIMGMatch.bind(this))
      }
    },
    formatURLMatch: function (match) {
      match = match.trim()
      var text = this.options.removeHTTP ? removeHTTP(match) : match
      return [
        ' <a href="' + prepHTTP(match) + '"' + this.attrs + '>',
        text,
        '</a> '
      ].join('')
    },
    formatIMGMatch: function (match) {
      match = match.trim()
      var imgRe = /\.(jpe?g|png|gif)$/
      var isIMG = imgRe.test(match)
      if (isIMG) {
        return [
          '<img src="' + prepHTTP(match.trim()) + '"' + this.attrs + '/>'
        ].join('')
      }

      return this.formatURLMatch(match)
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

  function autolink (string, options) {
    return new Autolink(string, options).parse()
  }

  if (typeof module !== 'undefined') {
    module.exports = autolink
  } else if (typeof window !== 'undefined') {
    window.VueAutolink = autolink
  }
})();
