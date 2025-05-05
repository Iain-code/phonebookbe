const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log("Input a password or command");
    process.exit(1);
}

const password = process.argv[2]
const dbUrl = `mongodb+srv://iainv1010:${password}@cluster0.kphy92i.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;

async function main() {
    try {
        await mongoose.connect(dbUrl)
        console.log("connected to database")
        mongoose.set('strictQuery', false);

    const personSchema = new mongoose.Schema({
        name: String,
        number: String,
    })
    const Person = mongoose.model("Person", personSchema)

    async function makePerson(person) {
        try {
            await person.save();
            console.log(`added ${person.name} number ${person.number} to the phonebook`);
            console.log(person)
        } catch (error) {
            console.log("error making person");
        } finally {
            mongoose.connection.close()
        }
    }
    
    async function findPerson() {
        const results = await Person.find({})
        results.forEach(result => {
            console.log(result)
    })}
        
    if (process.argv.length === 5) {
        const name = process.argv[3];
        const number = process.argv[4];
        const person = new Person({
            name: name,
            number: number,
        })
        await makePerson(person)
    }

    if (process.argv.length === 3) {
        try {
            console.log("finding people...")
            await findPerson()
        } catch (error) {
            console.log("error finding people")
        } finally {
            mongoose.connection.close()
        }
    }

    } catch (error) {
        console.log("failed to connect to database")
        process.exit(1)
    }
    }

main()

