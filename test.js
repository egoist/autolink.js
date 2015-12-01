const autoLink = require('./')

describe('main', () => {
  it('test no http', done => {
    const string = 'github.com/egoist, image twitter.com/shomin_sample.jpg no i@google.com'
    const result = '<a href="http://github.com/egoist">http://github.com/egoist</a>, image <a href="http://twitter.com/shomin_sample.jpg">http://twitter.com/shomin_sample.jpg</a> no i@google.com'
    autoLink(string, {image: false, email: false}).should.equal(result)
    done()
  })
  it('replace only url', done => {
    const string = 'http://github.com/egoist, image http://twitter.com/shomin_sample.jpg no i@google.com'
    const result = '<a href="http://github.com/egoist">http://github.com/egoist</a>, image <a href="http://twitter.com/shomin_sample.jpg">http://twitter.com/shomin_sample.jpg</a> no i@google.com'
    autoLink(string, {image: false, email: false}).should.equal(result)
    done()
  })
  it('replace url and image', done => {
    const string = 'url http://github.com/egoist ok, image http://twitter.com/shomin_sample.jpg'
    const result = 'url <a href="http://github.com/egoist">http://github.com/egoist</a> ok, image <img src="http://twitter.com/shomin_sample.jpg"/>'
    autoLink(string).should.equal(result)
    done()
  })
  it('makes attrs for image', done => {
    const string = 'url http://github.com/egoist ok, image http://twitter.com/shomin_sample.jpg too'
    autoLink(string, {imageAttr: {'data-lazy': true, 'pattern': '[a-zA-Z0-9]'}})
      .should
      .equal('url <a href="http://github.com/egoist">http://github.com/egoist</a> ok, image <img src="http://twitter.com/shomin_sample.jpg" data-lazy="true" pattern="[a-zA-Z0-9]"/> too')
    done()
  })
  it('makes attrs for url', done => {
    const string = 'url http://github.com/egoist ok, image http://twitter.com/shomin_sample.jpg too'
    autoLink(string, {linkAttr: {'data-lazy': true, 'pattern': '[a-zA-Z0-9]'}})
      .should
      .equal('url <a href="http://github.com/egoist" data-lazy="true" pattern="[a-zA-Z0-9]">http://github.com/egoist</a> ok, image <img src="http://twitter.com/shomin_sample.jpg"/> too')
    done()
  })
  it('makes attrs for both', done => {
    const string = 'url http://github.com/egoist ok, image http://twitter.com/shomin_sample.jpg too'
    autoLink(string, {linkAttr: {'data-lazy': true, 'pattern': '[a-zA-Z0-9]'}, imageAttr: {'data-image': true}, sharedAttr: {'data-common': true}})
      .should
      .equal('url <a href="http://github.com/egoist" data-common="true" data-lazy="true" pattern="[a-zA-Z0-9]">http://github.com/egoist</a> ok, image <img src="http://twitter.com/shomin_sample.jpg" data-common="true" data-image="true"/> too')
    done()
  })
  it('replace email', done => {
    const string = 'this is my email i@0x.co.cc yeah'
    const result = 'this is my email <a href="mailto:i@0x.co.cc">i@0x.co.cc</a> yeah'
    autoLink(string).should.equal(result)
    done()
  })
  it('test dash', done => {
    const string = 'dash url http://what.com/dash-url/haha ok'
    const result = 'dash url <a href="http://what.com/dash-url/haha">http://what.com/dash-url/haha</a> ok'
    autoLink(string).should.equal(result)
    done()
  })
  it('test br', done => {
    const string = 'what\r\nif\nyou like me'
    const result = 'what<br />if<br />you like me'
    autoLink(string).should.equal(result)
    done()
  })
  it('replace cloudmusic', done => {
    const string = 'a http://music.163.com/#/song?id=36103237 b'
    const result = 'a <iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="http://music.163.com/outchain/player?type=2&id=36103237&auto=1&height=66"></iframe> b'
    autoLink(string, {cloudmusic: true}).should.equal(result)
    done()
  })
  it('replace kickstarter', done => {
    const string = 'a https://www.kickstarter.com/projects/1546683916/treasures-of-the-universe-unique-astrophotography?ref=home_popular b'
    const result = 'a <iframe width="480" height="360" src="https://www.kickstarter.com/projects/1546683916/treasures-of-the-universe-unique-astrophotography/widget/video.html" frameborder="0" scrolling="no"> </iframe> b'
    autoLink(string, {kickstarter: true}).should.equal(result)
    done()
  })
  it('replace youtube', done => {
    const string = 'a  https://www.youtube.com/watch?v=5vOAxP-u5KA b'
    const result = 'a  <iframe width="560" height="315" src="https://www.youtube.com/embed/5vOAxP-u5KA" frameborder="0" allowfullscreen></iframe> b'
    autoLink(string, {youtube: true}).should.equal(result)
    done()
  })
  it('replace youku', done => {
    const string = 'a  http://v.youku.com/v_show/id_XMTQwMDUzODM0MA==.html?f=23710673#paction b'
    const result = 'a  <iframe height=498 width=510 src="http://player.youku.com/embed/XMTQwMDUzODM0MA==" frameborder=0 allowfullscreen></iframe> b'
    autoLink(string, {youku: true}).should.equal(result)
    done()
  })
})
