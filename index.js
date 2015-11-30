(function () {
  function AutoLink (string, options) {
    options = options || {}
    this.string = string
    this.options = options
    this.attrs = ''
    this.linkAttr = ''
    this.imageAttr = ''
    if (this.options.sharedAttr) {
      this.attrs = getAttr(this.options.sharedAttr)
    }
    if (this.options.linkAttr) {
      this.linkAttr = getAttr(this.options.linkAttr)
    }
    if (this.options.imageAttr) {
      this.imageAttr = getAttr(this.options.imageAttr)
    }
  }

  AutoLink.prototype = {
    constructor: AutoLink,
    parse: function () {
      var shouldReplaceImage = defaultTrue(this.options.image)
      var shouldRelaceEmail = defaultTrue(this.options.email)
      var urlWithImageRe = new RegExp('(\\s?)((http|https|ftp)://([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-_]*)*\/?)', 'gim')
      var result
      if (!shouldReplaceImage) {
        result = this.string.replace(urlWithImageRe, this.formatURLMatch.bind(this))
      } else {
        result = this.string.replace(urlWithImageRe, this.formatIMGMatch.bind(this))
      }
      if (shouldRelaceEmail) {
        result = this.formatEmailMatch.call(this, result)
      }
      return result
    },
    formatURLMatch: function (match, p1) {
      match = match.trim()
      var text = this.options.removeHTTP ? removeHTTP(match) : match
      return p1 + '<a href="' + prepHTTP(match) + '"' + this.attrs + this.linkAttr + '>' + text + '</a>'

    },
    formatIMGMatch: function (match, p1) {
      match = match.trim()
      var imgRe = /\.(jpe?g|png|gif)$/
      var isIMG = imgRe.test(match)
      if (isIMG) {
        return p1 + '<img src="' + prepHTTP(match.trim()) + '"' + this.attrs + this.imageAttr + '/>'
      }
      return this.formatURLMatch(match, p1)
    },
    formatEmailMatch: function (text) {
      var emailRe = /[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?/gi
      return text.replace(emailRe, '<a href="mailto:$&"' + this.attrs + this.linkAttr + '>$&</a>')
    }
  }

  function defaultTrue (val) {
    return (typeof val === 'undefined') ? true : val
  }

  function getAttr (obj) {
    var attr = ''
    for (var key in obj) {
      if (key) {
        attr += (' ' + key + '="' + obj[key] + '"')
      }
    }
    return attr
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
