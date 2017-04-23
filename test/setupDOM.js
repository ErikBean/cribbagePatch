require('babel-register')()

var jsdom = require('jsdom').jsdom

var exposedProperties = ['window', 'navigator', 'document']

global.document = jsdom('<!doctype html><html><body><div id="app"></div></body></html>')

global.window = document.defaultView
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property)
    global[property] = document.defaultView[property]
  }
})
global.navigator = {
  userAgent: 'node.js'
};
global.window.localStorage = {
  getItem: () => null,
  setItem: () => null
}

global.Gun = () => ({
  get: function(){
    return this
  },
  map: function(){
    return this
  },
  path: function() {
    return this
  },
  put: function() {
    return this
  }
})