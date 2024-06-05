const express = require('express')
const app = express()
require('dotenv').config()

const Note = require('./models/note')

// Middleware para servir archivos estáticos desde el directorio 'dist'
// Middleware para servir archivos estáticos desde el directorio 'dist'
app.use(express.static('dist'))

// Middleware para habilitar CORS
const cors = require('cors')
app.use(cors())

// Middleware para analizar solicitudes JSON
app.use(express.json())

// Middleware para registrar solicitudes
// Middleware para habilitar CORS
const cors = require('cors')
app.use(cors())

// Middleware para analizar solicitudes JSON
app.use(express.json())

// Middleware para registrar solicitudes
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)

// Rutas
// Rutas
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.post('/api/notes', (request, response, next) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  }).catch(error=> next(error))
})

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Nueva ruta para actualizar la importancia de una nota
app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body
  
  Note.findByIdAndUpdate(request.params.id, {content, important}, { new: true, runValidators:true,context:"query" })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

// Middleware para manejar rutas desconocidas
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
// Middleware para manejar rutas desconocidas
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// Middleware para manejar errores
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({error: error.message})
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
