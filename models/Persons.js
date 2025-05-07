const mongoose = require('mongoose')

mongoose.set('strictQuery', false);

function validatorFunc(item) {
   if (item[2] === "-" || item[3] === "-" && !isNaN(parseInt(item[4]))) {
    return true
   } else {
    return false
   }
}  

const validationMessage = [validatorFunc, "Incorrect input value"]

const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minlength: 3,
      required: true
    },
    number: {
      type: String,
      validate: {
        validator: validatorFunc,
        message: validationMessage
      },
      minlength: 8,
      required: true,
    },
}, { collection: 'people' })

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model("Person", personSchema)

module.exports = Person