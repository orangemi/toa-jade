toa-jade
========

Jade render module for toa.

## Usage:
```
var toa = require('toa')
var toaJade = require('toa-jade')

var app = toa(function () {
  return this.render('user', {name: 'toa', age: 1})
})

toaJade(app, {
  root: 'template'
})

app.listen(3000)
```

## API
```
var toaJade = require('toa-jade')
```

### toaJade(toaApp, globalOptions)
- globalOptions (Object)
  - root (String): Default `process.cwd()`
  - data (Object): global data, Default is `{}`
  - debug (Boolean): Default `false`
  - cache (Boolean): Default `true`
  - compileDebug (Boolean): Default `false`
  - context (Object): Default `toa.context`
  - extName (String): Default `.jade`

### context.render(templateName, data, renderOptions)
- templateName (String): template name without ext
- data: render data, Default is `{}`
- renderOptions (Object): replace `globalOptions`
