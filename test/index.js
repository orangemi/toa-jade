'use strict'
/* global describe, it */

var assert = require('assert')
var path = require('path')
var render = require('../lib/index')
var request = require('supertest')
var toa = require('toa')

describe('test/test.js', function () {
  describe('init()', function () {
    var app = toa()

    it('should init ok', function () {
      render(app)
      assert.equal(typeof app.context.render, 'function')
    })

    it('should throw error if use again', function () {
      assert.throws(function () {
        render(app)
      })
    })
  })

  describe('server', function () {
    it('should render page ok', function (done) {
      var app = toa(function () {
        var user = {
          name: 'toa'
        }
        return this.render('user', {user: user})
      })

      render(app, {
        root: path.resolve(__dirname, '../example/template')
      })

      request(app.listen())
        .get('/')
        .expect('content-type', 'text/html; charset=utf-8')
        .expect(/<title>toa-jade<\/title>/)
        .expect(/Toa/)
        .expect(200, done)
    })

    it('should render page 2nd ok', function (done) {
      var app = toa(function () {
        var user = {
          name: 'toa'
        }
        return this.render('user', {user: user})
      })

      render(app, {
        root: path.resolve(__dirname, '../example/template')
      })

      var server = app.listen()
      request(server).get('/')
        .expect('content-type', 'text/html; charset=utf-8')
        .expect(/<title>toa-jade<\/title>/)
        .expect(/Toa/)
        .expect(200, function () {
          request(server)
            .get('/')
            .expect('content-type', 'text/html; charset=utf-8')
            .expect(/<title>toa-jade<\/title>/)
            .expect(/Toa/)
            .expect(200, done)
        })
    })
  })
})
