import express from "express"
import path from "path"

const host = express.Router()

host.use(express.static(path.join(__dirname, "build")))

host.get('*', (request, response) => {
    response.sendFile(__dirname + '/build/index.html')
})

export default host