import express from "express";

// Create a new Express app
const app = express();
const port = process.env.PORT || 4242;

const sportiek =
  "https://raw.githubusercontent.com/DikkeTimo/proof-of-concept-Sportiek/main/json/localjssportiek.json";
const sportiekone = "https://www.sportiek.com/feed/wintersport1.php";

const datasportiek = [[sportiek], [sportiekone]];
const [data1, data2] = await Promise.all(datasportiek.map(fetchJson));
const data = { data1, data2 };

const checkdata = data1.filter((item) => {
  return (item.departurePricePersons === 8 || item.departurePricePersons === 12)
});




var accommodations = {};
// Loop door alle data, en maak per accommodatie een nieuw object aan
// if accommodations.id {
// accommodations.id.push
// else
// accommodations.id = []
// accommodations.id.push
// accommodations: {

// 975: [
//   { ...},
//   { ... },
//   { ... }
// ],
// 877: [

// ]}

// Set EJS as the template engine and specify the views directory
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static("public"));

app.get("/", async function (request, response) {
  response.render("index", { data1: data1, checkdata: checkdata});
});

app.get("/overview", async function (request, response) {
  response.render("overviewpage", { data2: data2, checkdata: checkdata});
});

app.listen(port, () => {
  console.log("listening on http://localhost:" + port);
});

async function fetchJson(urls) {
  return await fetch(urls)
    .then((response) => response.json())
    .catch((error) => error);
}
