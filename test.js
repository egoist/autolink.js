const autoLink = require('./')

describe('main', () => {
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
})
