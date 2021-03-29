const server = require('./api/server.js')

server.get('/', (req, res) => {
    res.status(200).send({ message: 'Welcome!' })
})

server.all('*', (req, res) => {
    res.status(404).send({ message: 'Oops! we took a wrong turn.' })
})

const PORT = process.env.PORT || 7777
server.listen(PORT, () => {
    console.log(`\n ---Server listening on port: ${PORT}--- \n`)
})

module.exports = server