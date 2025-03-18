const escape = require('escape-html')

const sanitize = str => str
  .replace(/<udiv([ >])/gm, '<div$1')
  .replace(/<\/udiv>/gm, '</div>')

exports.name = 'highlight.js'
exports.inputFormats = ['code', 'highlight', 'highlightjs', 'highlight.js']
exports.outputFormat = 'html'

exports.render = function (str, options) {
  options = options || {}
  if (str) str = sanitize(str)

  return options.escape === false ? str : escape(str)
}
