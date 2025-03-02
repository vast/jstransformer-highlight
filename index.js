'use strict'

const hljs = require('highlight.js')
const escape = require('escape-html')
const jsdom = require('jsdom')
const mergeHTMLPlugin = require('./lib/mergeHTMLPlugin')

const JSDOM = jsdom.JSDOM
hljs.configure({
  hideUpgradeWarningAcceptNoSupportOrSecurityUpdates: true,
  ignoreUnescapedHTML: true,
  throwUnescapedHTML: false,
})
hljs.addPlugin(mergeHTMLPlugin)

const sanitize = str => str
  .replace(/<udiv([ >])/gm, '<div$1')
  .replace(/<\/udiv>/gm, '</div>')

exports.name = 'highlight.js'
exports.inputFormats = ['code', 'highlight', 'highlightjs', 'highlight.js']
exports.outputFormat = 'html'

exports.render = function (str, options) {
  options = options || {}
  if (str) str = sanitize(str)

  const isLanguageSupported = Boolean(hljs.getLanguage(options.lang))
  const languageClass = (options.auto || !options.lang) ? '' : `language-${options.lang}`

  if (options.auto === false && !isLanguageSupported) {
    return escape(str)
  }

  if (!options.auto && options.lang && !isLanguageSupported) {
    return escape(str)
  }

  const html = options.escape === false ? str : escape(str)
  const node = `<pre><code class="${languageClass}">${html}</code></pre>`
  const dom = new JSDOM(node)
  const document = dom.window.document
  global.document = document

  const el = document.querySelector('code')
  hljs.highlightElement(el)

  return el.innerHTML
}
