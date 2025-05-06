require('dotenv').config()
const express = require("express")
const logger = require('morgan');
const cors = require('cors')
const Person = require("./models/Persons");
const mongo = require("./mongo")

const app = express()
app.use(cors());
app.use(express.static('dist'))
app.use(logger('tiny'));
app.use(express.json())

const now = new Date()

app.get('/api/persons', (request, response, next) => {
    Person.find({})
      .then(results => {
        if (results) {
          response.json(results)
        } else {
          response.status(404).json({
            error: "could not GET persons"
          })
        }
      })
      .catch(error => next(error))
      })

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
      .then((result) => {
        if (result) {
          response.json({result})
        } else {
          response.status(404).json({
            error: "failed to delete"
          })
        }
      })
      .catch(error => next(error))
  })

app.get("/api/persons/:id", (request, response, next) => {
    console.log("Finding individual person...")
    Person.findById(request.params.id)
      .then((result) => {
        if (result) {
          response.status(200).json(result)
        } else {
          response.status(404).json({
            error: "failed to get person"
          })
        }
      })
      .catch(error => next(error))
})

app.put("/api/persons/:id", (request, response, next) => {
    const body = request.body
    const id = request.params.id
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "no content found"
        })
    }
    const updatedPerson = {
      name: body.name,
      number: body.number
    };

    Person.findByIdAndUpdate(id, updatedPerson, { new: true, runValidators: true })
    .then((result) => {
      if (result) {
        response.status(200).json(result)
      } else {
        response.status(404).json({
          error: "malformed ID"
        })
      }
      })
      .catch(error => {
        console.log(`This is my console.log ${error}`)
        next(error)
      })
    })

app.post("/api/persons", (request, response, next) => {
    
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "no content found"
        })
    }
    const addedPerson = new Person({
        name: body.name,
        number: body.number
    })
    addedPerson.save().then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => next(error))
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
