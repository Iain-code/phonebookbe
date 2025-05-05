const express = require("express")
const logger = require('morgan');
const cors = require('cors')

const app = express()
app.use(cors());
app.use(express.static('dist'))
app.use(logger('tiny'));

const now = new Date()
app.use(express.json())

app.get("/api/persons", (request, response) => {
    Persons.find({}).then(people => {
        response.json(people)
    })
})

app.get("/api/persons/:id", (request, response) => {
    const foundPerson = persons.find(person => person.id === request.params.id)
    const body = request.body
    console.log(request.params.id)

    if (!foundPerson) {
        response.status(400).json({
            error: "content missing"
        })
    } else {
    response.json(foundPerson)
    }
})

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id
    const originalLength = persons.length;
    persons = persons.filter((person) => person.id.toString() !== id)
    
    if (persons.length < originalLength) {
        response.status(204).end(); // Successfully deleted
    } else {
        response.status(404).json({error: "Person not found"}); // No person found with that ID
    }
})

app.put("/api/persons/:id", (request, response) => {
    const body = request.body
    const id = request.params.id
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "no content found"
        })
    }
    const addedPerson = {
        id: id,
        name: body.name,
        number: body.number
    }
    const newPersons = persons.map(person => person.name === body.name ? addedPerson : person)
    persons = newPersons
    response.status(200).json(addedPerson)
})

app.post("/api/persons", (request, response) => {
    
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "no content found"
        })
    }
    const found = persons.some(person => person.name === body.name)
    if (found) {
        return response.status(409).json({
            error: "user already exists"
        })
    }
    const generateId = () => {
        const id = Math.floor(Math.random() * 1000000)
        return id
    }
    const addedPerson = {
        id: generateId().toString(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(addedPerson);
    response.status(201).json(addedPerson);
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
