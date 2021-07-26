const User = require("../models/User")
const crypto = require('crypto')
const mailer = require('../../lib/mailer')


module.exports = {
  async create(req, res){
    //Valida se usuário tem acesso ao form de cadastro de usuário
    const {userId: id} = req.session
    const user = await User.findOne({where: {id}})
    
    if(!user.is_admin){
      return res.redirect('/admin/profile/')
    }
    
    return res.render('user/register')
  },

  async show(req, res){
    try {
      const {userId: id} = req.session

      const user = await User.findOne({where: {id}})

      if(!user) return res.render('user/register', {
        error: "Usuário não encontrado!"
      })

      return res.render('user/show', {user})

    } catch (error) {
      console.log(error)
    }
  },

  async edit(req, res){
    try {
      const {user} = req

      if(user.is_admin){
        const id = req.params.index

        const userFound = await User.findOne({where: {id}})

        return res.render('user/edit', {user: userFound})
      }

      return res.render('user/edit', {user})

    } catch (error) {
      console.log(error)
    }
  },

  async post(req, res){
    try {
      const newUser = req.body

      //cria a senha
      const password = crypto.randomBytes(6).toString("hex")

      newUser.password = password

      // const userId = await User.create(newUser)

      newUser.id = await User.create(newUser)

      //send email with link with the password
      await mailer.sendMail({
        to: newUser.email,
        from: 'no-reply@foodfy.com.br',
        subject: 'Seja bem vindo ao Foodfy',
        html: `<h2>Olá ${newUser.name},</h2>
        <p>
          Damos boas vindas, ao maior site de receitas do Brasil, 
          para ter acesso a sua conta utilize a senha gerada abaixo:
        </p>
        
        <h2>
          ${password}
        <h2>

        <p>
          <a href="http://localhost:3000/admin/users/login" target="_blank">
            Faça seu login :)
          </a>
        </p>
        `
      })

      //user notification that email is sended
      return res.render('user/edit', {
        user: newUser,
        success: "Email com senha gerada enviado com êxito!"
      })

    } catch (error) {
      console.log(error)

      return res.render('user/register', {
        error: "Erro inesperado, tente novamente!"
      })
    }
  },

  async put(req, res){
    try {
      const {user} = req
      let { name, email, isAdmin} = req.body

      if(!isAdmin){
        isAdmin = false
      }

      await User.update(user.id, {
        name,
        email,
        is_admin: isAdmin
      })

      return res.render('user/edit', {
        user: req.body,
        success: 'Conta atualizada com sucesso!'
      })

    } catch (error) {
      console.error(error)
      return res.render('user/index', {
        error: 'Algum erro aconteceu!'
      })
    }
  },

  async delete(req, res){
    try {
      await User.delete(req.body.id)
      
      return res.render("user/edit", {
        success: "Conta deletada com sucesso!"
      })
      
    } catch (error) {
      console.error(error)
      return res.render("user/edit", {
        user: req.body,
        error: "Erro ao tentar deletar a conta!"
      })
    }
  }
}