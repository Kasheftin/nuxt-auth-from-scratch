module.exports = ({db, express, bcrypt, jwt, jwtToken}) => {
  const routes = express.Router()

  routes.post('/login', (req, res) => {
    const email = req.body.email
    const password = req.body.password
    if (!email || !password) return res.status(400).json({type: 'error', message: 'email and password fields are essential for authentication.'})
    db.query('select * from `users` where `email`=?', email, (error, results) => {
      if (error) return res.status(500).json({type: 'error', message: 'db error', error})
      if (results.length == 0) return res.status(403).json({type: 'error', message: 'User with provided email not found in database.'})
      const user = results[0]
      bcrypt.compare(password, user.password, (error, result) => {
        if (error) return res.status(500).json({type: 'error', message: 'bcrypt error', error})
        if (result) {
          res.json({
            type: 'success',
            message: 'User logged in.',
            user: {id: user.id, email: user.email},
            token: jwt.sign({id: user.id, email: user.email}, jwtToken, {expiresIn: '7d'})
          })
        } else return res.status(403).json({type: 'error', message: 'Password is incorrect.'})
      })
    })
  })

  routes.get('/me', (req, res) => {
    const token = req.headers['x-access-token']
    if (!token) return res.status(400).json({type: 'error', message: 'x-access-token header not found.'})
    jwt.verify(token, jwtToken, (error, result) => {
      if (error) return res.status(403).json({type: 'error', message: 'Provided token is invalid.', error})
      return res.json({
        type: 'success',
        message: 'Provided token is valid.',
        result
      })
    })
  })

  return routes
}
