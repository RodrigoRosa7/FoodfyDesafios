const {date} = require('../../lib/utils')
const db = require('../../config/db')

module.exports = {
  all(callback){
    db.query(`
      SELECT recipes.*, chefs.name AS name_chef
      FROM recipes 
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      ORDER BY title`, function(err, results){
      if(err) throw `Database error! ${err}`

      return callback(results.rows)
    })
  },

  ChefSelectOptions(callback){
    db.query("SELECT id, name FROM chefs ORDER BY chefs.name", function(err, results){
      if(err) throw `Database error! ${err}`

      callback(results.rows)
    })
  },

  create(data, callback){
    const query = `
    INSERT INTO recipes(
      chef_id,
      image,
      title,
      ingredients,
      preparations,
      information,
      created_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id
    `

    const values = [
      data.chef,
      data.recipe_url,
      data.title,
      data.ingredients,
      data.preparations,
      data.information,
      date(Date.now()).iso
    ]

    db.query(query, values, function(err, results){
      if(err) throw `Database error! ${err}`

      callback(results.rows[0])
    })
  },

  find(index, callback){
    db.query(`
      SELECT recipes.*, chefs.name AS name_chef 
      FROM recipes 
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE recipes.id = $1`, [index], function(err, results){
      if(err) throw `Database error! ${err}`

      return callback(results.rows[0])
    })
  },

  update(data, callback){
    const query = `
    UPDATE recipes SET
      chef_id = ($1),
      image = ($2),
      title = ($3),
      ingredients = ($4),
      preparations = ($5),
      information = ($6)
    WHERE id = $7
    `

    const values = [
      data.chef,
      data.recipe_url,
      data.title,
      data.ingredients,
      data.preparations,
      data.information,
      data.id
    ]

    db.query(query, values, function(err, results){
      if(err) throw `Database error! ${err}`

      return callback()
    })
  },

  delete(id, callback){
    db.query(`DELETE FROM recipes WHERE id = $1`, [id], function(err, results){
      if(err) throw `Database error! ${err}`

      return callback()
    })
  },

  findBy(params) {
    const {filter, limit, offset, callback} = params

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
    SELECT recipes.*, ${totalQuery},
    chefs.name AS name_chef
    FROM recipes 
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
    ${filterQuery}
    ORDER BY recipes.title
    LIMIT $1 OFFSET $2
    `

    db.query(query, [limit, offset], function(err, results){
      if(err) throw `Database error! ${err}`

      callback(results.rows)
    })
  },

  paginate(params){
    const {limit, offset, callback} = params

    let query = `
    SELECT recipes.*, 
    (SELECT COUNT(*) FROM recipes) AS total,
    chefs.name AS name_chef
    FROM recipes 
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
    `
    
    query = `${query}
    ORDER BY recipes.title
    LIMIT $1 OFFSET $2
    `

    db.query(query, [limit, offset], function(err, results){
      if(err) throw `Database error! ${err}`

      callback(results.rows)
    })

  }
}