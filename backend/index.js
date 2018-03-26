const mysql = require('mysql')
const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const google = require('googleapis')
const config = require('./config')
const auth = require('./auth')

try {
  const db = mysql.createConnection(config.db)
  const app = express()
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: true
  }))

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, x-access-token')
    if (req.method === 'OPTIONS') {
      res.sendStatus(200)
    }
    else {
      next()
    }
  })

  app.get('/test', (req, res) => {
    db.query('select 1+1', (error, results) => {
      if (error) return res.status(500).json({type: 'error', error})
      res.json({type: 'success', message: 'Test OK', results})
    })
  })

  app.use('/auth', auth({db, express, bcrypt, jwt, config, google}))

  app.listen(config.port)
  console.log('App is running on port ' + config.port)
} catch (e) {
  process.exit(1)
}
