(function () {
  /**
   * AutoLink constructor function
   *
   * @param {String} text
   * @param {Object} options
   * @constructor
   */
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
    /**
     * call relative functions to parse url/email/image
     *
     * @returns {String}
     */
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
    /**
     * @param {String} match
     * @returns {String} Offset 1
     */
    formatURLMatch: function (match, p1) {
      match = match.trim()
      var text = this.options.removeHTTP ? removeHTTP(match) : match
      return p1 + '<a href="' + prepHTTP(match) + '"' + this.attrs + this.linkAttr + '>' + text + '</a>'

    },
    /**
     * @param {String} match
     * @param {String} Offset 1
     */
    formatIMGMatch: function (match, p1) {
      match = match.trim()
      var imgRe = /\.(jpe?g|png|gif)$/
      var isIMG = imgRe.test(match)
      if (isIMG) {
        return p1 + '<img src="' + prepHTTP(match.trim()) + '"' + this.attrs + this.imageAttr + '/>'
      }
      return this.formatURLMatch(match, p1)
    },
    /**
     * @param {String} text
     */
    formatEmailMatch: function (text) {
      var emailRe = /[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?/gi
      return text.replace(emailRe, '<a href="mailto:$&"' + this.attrs + this.linkAttr + '>$&</a>')
    }
  }

  /**
   * return true if undefined
   * else return itself
   *
   * @param {Boolean} val
   * @returns {Boolean}
   */
  function defaultTrue (val) {
    return (typeof val === 'undefined') ? true : val
  }

  /**
   * parse attrs from object
   *
   * @param {Object} obj
   * @returns {Stirng}
   */
  function getAttr (obj) {
    var attr = ''
    for (var key in obj) {
      if (key) {
        attr += (' ' + key + '="' + obj[key] + '"')
      }
    }
    return attr
  }

  /**
   * @param {String} url
   * @returns {String}
   */
  function prepHTTP (url) {
    if (url.substring(0, 4) !== 'http' && url.substring(0, 2) !== '//') {
      return 'http://' + url
    }
    return url
  }

  /**
   * @param {String} url
   * @returns {String}
   */
  function removeHTTP (url) {
    return url.replace(/.*?:\/\//g, '')
  }

  /**
   * return an instance of AutoLink
   *
   * @param {String} string
   * @param {Object} options
   * @returns {Object}
   */
  function autoLink (string, options) {
    return new AutoLink(string, options).parse()
  }

  if (typeof module !== 'undefined') {
    module.exports = autoLink
  } else if (typeof window !== 'undefined') {
    window.autoLink = autoLink
  }
})();
