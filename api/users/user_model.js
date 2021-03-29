const db = require('../../data/dbConfig')

module.exports = {
    find,
    insert,
    findBy,
    findById,
    update,
    remove
}

function find() {
    return db('users')
}

function insert(user) {
    return db('users')
    .insert(user);
}

function findBy(filter) {
    return db('users')
    .where(filter)
    .orderBy('user_id')
}

function findById(id) {
    return db('users')
    .where('id', id)
}

function update(id, changes) {
    return db('users')
    .update(changes)
    .where('id', id)
    .then(id =>{
        return db('users').where('id', id)
    })
}

function remove(id) {
    return db('users')
    .where('id', id)
    .del()
    .then(id => {
        return db('users').where('id', id)
    })
}