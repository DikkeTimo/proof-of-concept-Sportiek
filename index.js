// Import the required modules
import express from "express";

// Create a new Express app
const app = express();
const port = process.env.PORT || 4242;

// Set EJS as the template engine and specify the views directory
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static("public"));

app.get("/", async function (request, response) {
  response.render("index");
});

app.listen(port, () => {
  console.log("listening on http://localhost:" + port);
});
