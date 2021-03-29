exports.up = function(knex) {
  return knex.schema
  .createTable("users", users => {
      users
      .increments('user_id')
      .unique();
      users
      .string('username', 255)
      .unique()
      .notNullable();
      users
      .string('phone_number', 255)
      .unique()
      .notNullable();
      users
      .string('password', 255)
      .notNullable();
  })
  .createTable('plants', plants => {
       plants
       .increments('plant_id')
       .unique()
       .onUpdate('CASCADE')
       .onDelete('CASCADE');
       plants
       .string('nickname', 255);
       plants
       .string('species', 255)
       .notNullable();
       plants
       .string('h2o', 255) //talk to team about proper implementation of this feature
       .notNullable();
       plants
       .string('plant-image', 255) //talk to team about proper implementation of this too
       plants
       .integer('user_id')
       .unsigned()
       .notNullable()
       .references('user_id')
       .inTable('users')
       .onUpdate('CASCADE')
       .onDelete('CASCADE')
  })
};

exports.down = function(knex) {
  return knex.schema
  .dropTableIfExists('plants')
  .dropTableIfExists('users')
};
