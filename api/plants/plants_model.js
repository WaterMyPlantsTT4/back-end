const db = require('../../data/dbConfig')

module.exports = {
    find,
    insert,
    findBy,
    update,
    remove
}

function find() {
    return db('plants')
}

function insert(plants) {
    return db('plants')
    .insert(plants);
}

function findBy(id) {
    return db('plants')
    .where(id, 'id')
}

function update(id, changes) {
    return db('plants')
    .update(changes)
    .where('id', id)
    .then(id =>{
        return db('plants').where('id', id)
    })
}

function remove(id) {
    return db('plants')
    .where('id', id)
    .del()
    .then(id => {
        return db('plants').where('id', id)
    })
}