import autoLink from './'

describe('main', () => {
  it('test no http', () => {
    const string = 'github.com/egoist, image twitter.com/shomin_sample.jpg no i@google.com'
    const result = '<a href="http://github.com/egoist">http://github.com/egoist</a>, image <a href="http://twitter.com/shomin_sample.jpg">http://twitter.com/shomin_sample.jpg</a> no i@google.com'
    expect(autoLink(string, {image: false, email: false})).toBe(result)
  })
  it('replace only url', () => {
    const string = 'http://github.com/egoist, image http://twitter.com/shomin_sample.jpg no i@google.com'
    const result = '<a href="http://github.com/egoist">http://github.com/egoist</a>, image <a href="http://twitter.com/shomin_sample.jpg">http://twitter.com/shomin_sample.jpg</a> no i@google.com'
    expect(autoLink(string, {image: false, email: false})).toBe(result)
  })
  it('replace url and image', () => {
    const string = 'url http://github.com/egoist ok, image http://twitter.com/shomin_sample.jpg'
    const result = 'url <a href="http://github.com/egoist">http://github.com/egoist</a> ok, image <img src="http://twitter.com/shomin_sample.jpg"/>'
    expect(autoLink(string)).toBe(result)
  })
  it('makes attrs for image', () => {
    const string = 'url http://github.com/egoist ok, image http://twitter.com/shomin_sample.jpg too'
    expect(autoLink(string, {imageAttr: {'data-lazy': true, 'pattern': '[a-zA-Z0-9]'}}))
      .toBe('url <a href="http://github.com/egoist">http://github.com/egoist</a> ok, image <img src="http://twitter.com/shomin_sample.jpg" data-lazy="true" pattern="[a-zA-Z0-9]"/> too')
  })
  it('makes attrs for url', () => {
    const string = 'url http://github.com/egoist ok, image http://twitter.com/shomin_sample.jpg too'
    expect(autoLink(string, {linkAttr: {'data-lazy': true, 'pattern': '[a-zA-Z0-9]'}}))
      .toBe('url <a href="http://github.com/egoist" data-lazy="true" pattern="[a-zA-Z0-9]">http://github.com/egoist</a> ok, image <img src="http://twitter.com/shomin_sample.jpg"/> too')
  })
  it('makes attrs for both', () => {
    const string = 'url http://github.com/egoist ok, image http://twitter.com/shomin_sample.jpg too'
    expect(autoLink(string, {linkAttr: {'data-lazy': true, 'pattern': '[a-zA-Z0-9]'}, imageAttr: {'data-image': true}, sharedAttr: {'data-common': true}}))
      .toBe('url <a href="http://github.com/egoist" data-common="true" data-lazy="true" pattern="[a-zA-Z0-9]">http://github.com/egoist</a> ok, image <img src="http://twitter.com/shomin_sample.jpg" data-common="true" data-image="true"/> too')
  })
  it('replace email', () => {
    const string = 'this is my email i@0x.co.cc yeah'
    const result = 'this is my email <a href="mailto:i@0x.co.cc">i@0x.co.cc</a> yeah'
    expect(autoLink(string)).toBe(result)
  })
  it('test dash', () => {
    const string = 'dash url http://what.com/dash-url/haha ok'
    const result = 'dash url <a href="http://what.com/dash-url/haha">http://what.com/dash-url/haha</a> ok'
    expect(autoLink(string)).toBe(result)
  })
  it('test br', () => {
    const string = 'what\r\nif\nyou like me'
    const result = 'what<br />if<br />you like me'
    expect(autoLink(string)).toBe(result)
  })
  it('replace cloudmusic', () => {
    const string = 'a http://music.163.com/#/song?id=36103237 b'
    const result = 'a <iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="http://music.163.com/outchain/player?type=2&id=36103237&auto=1&height=66"></iframe> b'
    expect(autoLink(string, {cloudmusic: true})).toBe(result)
  })
  it('replace kickstarter', () => {
    const string = 'a https://www.kickstarter.com/projects/1546683916/treasures-of-the-universe-unique-astrophotography?ref=home_popular b'
    const result = 'a <iframe width="480" height="360" src="https://www.kickstarter.com/projects/1546683916/treasures-of-the-universe-unique-astrophotography/widget/video.html" frameborder="0" scrolling="no"> </iframe> b'
    expect(autoLink(string, {kickstarter: true})).toBe(result)
  })
  it('replace youtube', () => {
    const string = 'a  https://www.youtube.com/watch?v=5vOAxP-u5KA b'
    const result = 'a  <iframe width="560" height="315" src="https://www.youtube.com/embed/5vOAxP-u5KA" frameborder="0" allowfullscreen></iframe> b'
    expect(autoLink(string, {youtube: true})).toBe(result)
  })
  it('replace youku', () => {
    const string = 'a  http://v.youku.com/v_show/id_XMTQwMDUzODM0MA==.html?f=23710673#paction b'
    const result = 'a  <iframe height=498 width=510 src="http://player.youku.com/embed/XMTQwMDUzODM0MA==" frameborder=0 allowfullscreen></iframe> b'
    expect(autoLink(string, {youku: true})).toBe(result)
  })
  it('replace html tag', () => {
    const string = '<script>'
    expect(autoLink(string, {safe: true})).toBe('&lt;script&gt;')
  })
})
