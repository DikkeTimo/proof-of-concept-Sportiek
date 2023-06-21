import express from "express";
import { config } from "dotenv";
config();

// Create a new Express app
const app = express();
const port = process.env.PORT || 4242;

// Urls from .env file
const apiKey = process.env.API_URL_INFOMARTION;
const sportiekfeedone = process.env.API_URL_ACCOMMODATIES1;
const sportiekfeedtwo= process.env.API_URL_ACCOMMODATIES2
const sportiekfeedthree= process.env.API_URL_ACCOMMODATIES3

// Variabel name to the url's
const sportiekone = [apiKey];
const sportiekfeed1 = [sportiekfeedone]
const sportiekfeed2 = [sportiekfeedtwo]
const sportiekfeed3 = [sportiekfeedthree]

// all url's together
const urls = [sportiekone, sportiekfeed1, sportiekfeed2, sportiekfeed3];
const [data1, data2, data3, data4] = await Promise.all(urls.map(fetchJson));
const combinedData = [...data2, ...data3, ...data4];

const filterData = combinedData.reduce((acc, item) => {
  const existingItem = acc.find((el) => el.variantName === item.variantName);

  if (existingItem) {
    // Voeg de huidige datum alleen toe als deze nog niet in de bestaande item is opgenomen
    if (!existingItem.departureDates.includes(item.departureDate)) {
      existingItem.departureDates.push(item.departureDate);
    }
  } else {
    // Voeg een nieuw item toe met de huidige variantName en datum
    acc.push({
      accomodationId: item.accomodationId,
      departurePricePersons: item.departurePricePersons,
      variantName: item.variantName,
      complex_name: item.complex_name,
      departureDates: [item.departureDate],
      number: [item.number]
    });
  }

  return acc;
}, []);

// console.log(filterData)


// Compare accommodations
const comparedAccommodations = [];
data1.forEach(accommodation1 => {
  filterData.forEach(accommodation2 => {
    if (accommodation1.accomodationId === String(accommodation2.accomodationId)) {
      // Extract the common information
      const dorp = accommodation1.dorp
      const skigebied = accommodation1.skigebied

      // Add compared accommodation to the list
      comparedAccommodations.push({
        accommodationId: accommodation1.accomodationId,
        skigebied,
        dorp
      });
    }
  });
});


console.log(comparedAccommodations)

// if (filterData.accomodationId === comparedAccommodations.accommodationId) { 
//   dorp
//  } 


// const matchingAccommodations = comparedAccommodations.filter((comparedAccommodation) => {
//   return filterData.some((filterAccommodation) => {
//     return filterAccommodation.accommodationId === comparedAccommodation.accomodationId ;
//   });
// });


// const matchingDorps = matchingAccommodations.map((matchingAccommodation) => {
//   const matchingFilterAccommodation = filterData.find((filterAccommodation) => {
//     return filterAccommodation.accommodationId === matchingAccommodation.accomodationId;
//   });
//   return matchingFilterAccommodation.dorp;
// });

// console.log('Matching dorps:', matchingDorps);








// Set EJS as the template engine and specify the views directory
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static("public"));

app.get("/", async function (request, response) {
  response.render("index", { filterData, data1, data2, data3 ,data4, comparedAccommodations });
});

app.listen(port, () => {
  console.log("listening on http://localhost:" + port);
});


async function fetchJson(urls) {
  return await fetch(urls)
    .then((response) => response.json())
    .catch((error) => error);
}