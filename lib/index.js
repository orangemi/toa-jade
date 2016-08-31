'use strict'

var jade = require('jade')
var fs = require('fs')
var path = require('path')

/*
  globalOptions
    - root: process.cwd()
    - data: data
    - debug: false
    - cache: true
    - compileDebug: false
    - context: toa.context
    - extName: '.jade'

  render options:
    - data: Default data
    - debug: false
    - cache: true
    - compileDebug: false
    - context: toa.context
*/

module.exports = function (app, globalOptions) {
  if (app.context.render) throw new Error('app.context.render is exist!')
  globalOptions = globalOptions || {}
  var cache = {}
  var rootDir = path.resolve(process.cwd(), globalOptions.root || '')
  app.context.render = function (view, data, options) {
    options = options || {}
    data = assign({}, globalOptions.data, this.state, data)
    var context = options.context || globalOptions.context || this
    var filename = path.join(rootDir, view + (globalOptions.extName || '.jade'))
    var renderFn = function (callback) {
      fs.readFile(filename, function (err, buffer) {
        if (err) throw err
        var fn = jade.compile(buffer, {
          cache: options.cache || globalOptions.cache,
          debug: options.debug || globalOptions.debug,
          filename: filename,
          compileDebug: options.compileDebug || globalOptions.compileDebug
        })

        if (options.cache !== false && globalOptions.cache !== false) cache[view] = fn
        return callback(null, fn.call(context, data))
      })
    }

    if (cache[view]) {
      renderFn = function (callback) {
        return callback(null, cache[view].call(context, data))
      }
    }

    return this.thunk(renderFn)(function (err, html) {
      if (err) throw err
      if (options.writeResp !== false) {
        this.type = 'html'
        this.body = html
      }
      return html
    })
  }
}

function assign () {
  var sources = Array.prototype.slice.call(arguments)
  var target = sources.shift()
  sources.forEach(function (source) {
    for (var key in source) {
      var value = source[key]
      if (!value) continue
      target[key] = typeof value !== 'function' ? value : value.call(target)
    }
  })
  return target
}
