const db = require('../../config/db')
const {hash} = require('bcryptjs')
const Recipe = require('../models/Recipe')
const fs = require('fs')

module.exports = {
  async findOne(filters){
    try {
      let query = "SELECT * FROM users"

      Object.keys(filters).map(key => {
        //WHERE | OR | AND
        query = `${query}
        ${key}
        `
        Object.keys(filters[key]).map(field => {
          query = `${query} ${field} = '${filters[key][field]}'`
        })
      })

      const results = await db.query(query)

      return results.rows[0]

    } catch (error) {
      console.log(error)
    }
  },

  async all(){
    try {
      let query = "SELECT * FROM users"

      const results = await db.query(query)

      return results.rows

    } catch (error) {
      console.log(error)
    }
  },

  async create (data){
    try {
      const query = `
      INSERT INTO users(
        name,
        email,
        password,
        is_admin
      ) VALUES ($1, $2, $3, $4)
      RETURNING id
      `

      const passwordHash = await hash(data.password, 8)

      const values = [
        data.name,
        data.email,
        passwordHash,
        data.isAdmin
      ]

      const results = await db.query(query, values)

      return results.rows[0].id

    } catch (error) {
      console.log(error)
    }
  },

  async update(id, fields){
    try {
      let query = "UPDATE users SET"

      Object.keys(fields).map((key, index, array) => {
        if((index + 1) < array.length){
          query = `${query}
            ${key} = '${fields[key]}',
          `
        } else {
          //last interation
          query = `${query}
            ${key} = '${fields[key]}'
            WHERE id = ${id}
          `
        }
      })

      await db.query(query)

      return

    } catch (error) {
      console.log(error)
    }
  },

  async delete(id){
    try {
      let results = await db.query(`
        SELECT recipes.*, recipe_id, file_id
        FROM recipes
        LEFT JOIN recipe_files ON (recipes.id = recipe_files.recipe_id)
        WHERE recipes.user_id = $1`, [id])

      const recipes = results.rows

      // const allFilesPromise = recipes.map(recipe => 
      //   Recipe.files(recipe.id))

      // let promiseFilesResults = await Promise.all(allFilesPromise)

      //get images
      let files = await Promise.all(recipes.map(async recipe => {
        const results = await db.query(`
          SELECT *
          FROM files
          WHERE files.id = $1
        `, [recipe.file_id])

        return results.rows[0]
      }))

      await db.query("DELETE FROM users WHERE id = $1", [id])

      // promiseFilesResults.map(results => {
      //   results.rows.map(file => fs.unlinkSync(file.path))
      // })
      files.map(async file => {
        fs.unlinkSync(file.path)
      })

      //remove images
      return files.map(async file => {
        await db.query(`DELETE FROM files WHERE files.id = $1`, [file.id])
      })

    } catch (error) {
      console.log(error)
    }
  }
}