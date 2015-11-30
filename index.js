(function () {
  var re = {
    http: /.*?:\/\//g,
    url: /(\s|^)((https?|ftp):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\w-\/\?\=\#\.])*(\s|$)/gi,
    image: /\.(jpe?g|png|gif)$/,
    email: /[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?/gi,
    cloudmusic: /http:\/\/music\.163\.com\/#\/song\?id=(\d+)/i,
    kickstarter: /(https?:\/\/www\.kickstarter\.com\/projects\/\d+\/[a-zA-Z0-9_-]+)(\?\w+\=\w+)?/i,
    youtube: /https?:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)(\?\w+\=\w+)?/i,
  }
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
      var shouldRelaceBr = defaultTrue(this.options.br)

      var result = ''
      if (!shouldReplaceImage) {
        result = this.string.replace(re.url, this.formatURLMatch.bind(this))
      } else {
        result = this.string.replace(re.url, this.formatIMGMatch.bind(this))
      }
      if (shouldRelaceEmail) {
        result = this.formatEmailMatch.call(this, result)
      }
      if (shouldRelaceBr) {
        result = result.replace(/\r?\n/g, '<br />')
      }
      return result
    },
    /**
     * @param {String} match
     * @returns {String} Offset 1
     */
    formatURLMatch: function (match, p1) {
      match = prepHTTP(match.trim())
      if (this.options.cloudmusic || this.options.embed) {
        if (match.indexOf('music.163.com/#/song?id=') > -1) {
          return match.replace(
            re.cloudmusic,
            p1 + '<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="http://music.163.com/outchain/player?type=2&id=$1&auto=1&height=66"></iframe>'
          )
        }
      }
      if (this.options.kickstarter || this.options.embed) {
        if (re.kickstarter.test(match)) {
          return match.replace(
            re.kickstarter,
            p1 + '<iframe width="480" height="360" src="$1/widget/video.html" frameborder="0" scrolling="no"> </iframe>'
          )
        }
      }
      if (this.options.youtube || this.options.embed) {
        if (re.youtube.test(match)) {
          return match.replace(
            re.youtube,
            p1 + '<iframe width="560" height="315" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>'
          )
        }
      }
      var text = this.options.removeHTTP ? removeHTTP(match) : match
      return p1 + '<a href="' + match + '"' + this.attrs + this.linkAttr + '>' + text + '</a>'
    },
    /**
     * @param {String} match
     * @param {String} Offset 1
     */
    formatIMGMatch: function (match, p1) {
      match = match.trim()
      var isIMG = re.image.test(match)
      if (isIMG) {
        return p1 + '<img src="' + prepHTTP(match.trim()) + '"' + this.attrs + this.imageAttr + '/>'
      }
      return this.formatURLMatch(match, p1)
    },
    /**
     * @param {String} text
     */
    formatEmailMatch: function (text) {
      return text.replace(re.email, '<a href="mailto:$&"' + this.attrs + this.linkAttr + '>$&</a>')
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
    return url.replace(re.http, '')
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
