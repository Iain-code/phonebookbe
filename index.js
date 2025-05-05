require('dotenv').config()
const express = require("express")
const logger = require('morgan');
const cors = require('cors')
const Person = require("./models/Persons");

const app = express()
app.use(cors());
app.use(express.static('dist'))
app.use(logger('tiny'));
app.use(express.json())

const now = new Date()

app.get("/api/persons", (request, response) => {
    Person.find({}).then(results => {
        results.forEach(result => {
            console.log(result)
        })
        response.json(results)
    }).catch(error => {
        console.error(error);
        response.status(500).json({ error: 'An error occurred' });
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
      .then((result) => {
        response.status(204).end()
      })
  })

app.get("/api/persons/:id", (request, response) => {
    Person.findById(request.params.id)
      .then((result) => {
        response.status(200).end()
      })    
})

app.put("/api/persons/:id", (request, response) => {
    const body = request.body
    const id = request.params.id
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "no content found"
        })
    }
    const exist = Person.findById(request.params.id).then(result)
    if (exist) {
        console.log("user already found")
        response.json({
            error: "user already in phonebook"
        })
    } else {
    const addedPerson = {
        id: id,
        name: body.name,
        number: body.number
    }
    response.status(200).json(addedPerson)
}
})

app.post("/api/persons", (request, response) => {
    
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
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
