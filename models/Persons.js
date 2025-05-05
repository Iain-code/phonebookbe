const mongoose = require('mongoose')

mongoose.set('strictQuery', false);

const password = process.argv[2]
const dbUrl = `mongodb+srv://iainv1010:${password}@cluster0.kphy92i.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;

console.log('connecting to', dbUrl)
mongoose
  .connect(dbUrl)
  .then((result) => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

  module.exports = mongoose.model('Note', noteSchema)