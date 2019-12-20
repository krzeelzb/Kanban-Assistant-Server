/* eslint-disable promise/always-return */
const mongoose = require("mongoose");

const http = require("http");
const app = require("./app");
const port = process.env.process || 5000;
const server = http.createServer(app);

// Connecting to the DB
mongoose.promise = global.Promise;

mongoose
    .connect("mongodb://localhost/trello", {
        useNewUrlParser: true,
        useCreateIndex: true,
    })
    .then(() => {
        console.log("Database connected");
    })
    .catch(err => console.log(err));

server.listen(port, () => {
    console.log(`listening on ${port}`);
});


