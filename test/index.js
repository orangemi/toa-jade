'use strict'
/* global describe, it */

const assert = require('assert')
const path = require('path')
const render = require('../lib/index')
const request = require('supertest')
const toa = require('toa')

describe('test/test.js', function () {
  describe('init()', function () {
    let app = toa()

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
      let app = toa(function () {
        let user = {
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
  })
})
