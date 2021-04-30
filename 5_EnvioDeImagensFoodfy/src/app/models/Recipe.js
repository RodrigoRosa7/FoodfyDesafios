const {date} = require('../../lib/utils')
const db = require('../../config/db')

module.exports = {
  all(){
    try {
      return db.query(`
      SELECT DISTINCT on (recipe_files.recipe_id) recipes.*, chefs.name AS name_chef, files.path AS file_path
      FROM recipe_files
      FULL JOIN recipes ON (recipe_files.recipe_id = recipes.id)
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      LEFT JOIN files ON (recipe_files.file_id = files.id)
      ORDER BY recipe_files.recipe_id`)

    } catch (error) {
      console.log(error)
    }
  },

  ChefSelectOptions(){
    try {
      return db.query("SELECT id, name FROM chefs ORDER BY chefs.name")
      
    } catch (error) {
      console.log(error)
    }
  },

  create(data){
    try {
      const query = `
      INSERT INTO recipes(
        chef_id,
        title,
        ingredients,
        preparations,
        information,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
      `

      const values = [
        data.chef,
        data.title,
        data.ingredients,
        data.preparations,
        data.information,
        date(Date.now()).iso
      ]

      return db.query(query, values)

    } catch (error) {
      console.log(error)
    }
  },

  find(index){
    try {
      return db.query(`
      SELECT recipes.*, chefs.name AS name_chef 
      FROM recipes 
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE recipes.id = $1`, [index])

    } catch (error) {
      console.log(error)
    }
  },

  update(data){
    try {
      const query = `
      UPDATE recipes SET
        chef_id = ($1),
        title = ($2),
        ingredients = ($3),
        preparations = ($4),
        information = ($5)
      WHERE id = $6
      RETURNING id
      `

      const values = [
        data.chef,
        data.title,
        data.ingredients,
        data.preparations,
        data.information,
        data.id
      ]

      return db.query(query, values)

    } catch (error) {
      console.log(error)
    }
  },

  delete(id){
    try {
      return db.query(`DELETE FROM recipes WHERE id = $1`, [id])  

    } catch (error) {
      console.log(error)
    }
  },

  RecipeFiles(id){
    try {
      return db.query(`SELECT * FROM recipe_files WHERE recipe_id = $1`, [id])
      
    } catch (error) {
      console.log(error)
    }
  },

  findBy(params) {
    try {
      const {filter, limit, offset} = params

      let query = "",
          filterQuery = "",
          totalQuery = "(SELECT COUNT(*) FROM recipes) AS total"

      
      if(filter) {
        filterQuery = `
        WHERE recipes.title ILIKE '%${filter}%'
        `

        totalQuery = `(
        SELECT COUNT(*) FROM recipes
        ${filterQuery}
        ) AS total`
      }

      query = `
      SELECT DISTINCT on (recipe_files.recipe_id) recipes.*, ${totalQuery},
      chefs.name AS name_chef, files.path AS file_path
      FROM recipe_files 
      FULL JOIN recipes ON (recipe_files.recipe_id = recipes.id)
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      LEFT JOIN files ON (recipe_files.file_id = files.id)
      ${filterQuery}
      ORDER BY recipe_files.recipe_id
      LIMIT $1 OFFSET $2
      `

      return db.query(query, [limit, offset])

    } catch (error) {
      console.log(error)
    }
  },

  paginate(params){
    try {
      const {limit, offset} = params

      let query = `
      SELECT DISTINCT on (recipe_files.recipe_id) recipes.*, 
      (SELECT COUNT(*) FROM recipes) AS total,
      chefs.name AS name_chef, files.path AS file_path
      FROM recipe_files 
      FULL JOIN recipes ON (recipe_files.recipe_id = recipes.id)
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      LEFT JOIN files ON (recipe_files.file_id = files.id)
      `
      query = `${query}
      ORDER BY recipe_files.recipe_id
      LIMIT $1 OFFSET $2
      `
      return db.query(query, [limit, offset])

    } catch (error) {
      console.log(error)
    }
  },

  files(id){
    try {
      return db.query(`
      SELECT files.*, recipe_id
      FROM files
      LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
      WHERE recipe_id = $1
      `, [id])
      
    } catch (error) {
      console.log(error)
    }
  }
}