const connect_to_db = require("./db/db");
const express = require('express')
var cors = require('cors')
connect_to_db();


const app = express()
app.use(cors())
const port = 5000
app.use(express.json())// to use req.body we need to use the express.json middleware



app.use("/api/admin" , require("./routes/admin"))
app.use("/api/user" , require("./routes/user"))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
     
console.log("we are in index.js");