const User = require('../models/User')

//é um middleware
async function post (req, res, next){
  const keys = Object.keys(req.body)

  for(key of keys){
    if(req.body[key] == ""){
      return res.render('user/register', {
        user: req.body,
        error: 'Por favor, preencha todos os campos!'
      })
    }
  }

  let {email, password, passwordRepeat} = req.body

  const user = await User.findOne({where: {email}})

  if(user) {
    return res.render('user/register', {
      user: req.body,
      error: 'Usuário já cadastrado.'
    })
  }

  if(password != passwordRepeat){
    return res.render('user/register', {
      user: req.body,
      error: 'A senha é diferente!'
    })
  }

  next()
}

module.exports = {
  post
}