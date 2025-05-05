require('dotenv').config()
const mongoose = require("mongoose");
const Person = require("./models/Persons")

const dbUrl = process.env.DBUrl

mongoose
  .connect(dbUrl)
  .then((result) => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

if (process.argv.length === 2) {

Person.find({}).then(result => {
    result.forEach(person => {
        console.log(person)
    })
})
}

if (process.argv.length === 5) {
    const name = process.argv[3];
    const number = process.argv[4];

    const person = new Person({
        name: name,
        number: number,
    })

    person.save().then((result) => {
    console.log(`added ${person.name} number ${person.number} to the phonebook`)
    console.log(person)    
}).catch((error) => {
    console.log("Error saving to phonebook")
}).finally(() => {
    mongoose.connection.close()
})
}

