const User = require("../models/User")

module.exports = {
  create(req, res){
    return res.render('user/register')
  },

  show(req, res){
    return res.render('user/show')
  },

  async edit(req, res){
    try {
      const {userId: id} = req.session

      const user = await User.findOne({where: {id}})

      if(!user) return res.render('user/register', {
        error: "Usuário não encontrado!"
      })

      return res.render('user/edit', {user})

    } catch (error) {
      console.log(error)
    }
  },

  async post(req, res){
    try {
      const userId = await User.create(req.body)

      req.session.userId = userId

      return res.redirect(`/admin/users/${userId}/editar`)

    } catch (error) {
      console.log(error)
    }
  }
}