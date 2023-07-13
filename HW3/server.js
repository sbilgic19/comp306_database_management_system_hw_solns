const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");

const app = express();

// Enable CORS
app.use(cors());
const PORT = 3000;
// Configure body-parser to handle POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "s3rk4ns3rk4n",
  database: "world",
});

// test connection
// app.get("/getAllCities", (req, res) => {
//   pool.query(`SELECT * FROM city`, (error, results) => {
//     if (error) throw error;
//     res.send(results);
//   });
// });


function contains(val, col_name, table_name) {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM ${table_name} WHERE ${col_name}="${val}"`,
      (err, result) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        return resolve(result.length > 0);
      }
    );
  });
}

app.get("/getDiffLang", (req, res) => {
  const { country1, country2 } = req.query;
  diff_lang(country1, country2)
  .then((result) => {
    res.send(result);
  })
  .catch((error) => {
    throw error;
  });
});

module.exports;
function diff_lang(country1, country2) {
  return new Promise((resolve, reject) =>{
  pool.query(
    `SELECT Language from countrylanguage, country  WHERE countrylanguage.CountryCode=country.Code and 
              country.Name=${country1} and Language NOT IN (SELECT Language from countrylanguage, country WHERE countrylanguage.CountryCode=country.Code
                 and country.Name=${country2}) `,
    (err, result) => {
      if (err) reject(err);
      resolve(result);
    }
  )});
}

app.get("/getDiffLangJoin", (req, res) => {
  const { country1, country2 } = req.query;
  diff_lang_join(country1, country2)
  .then((result) => {
    res.send(result);
  })
  .catch((error) => {
    throw error;
  });
});

module.exports;
function diff_lang_join(country1, country2) {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT cl1.Language
      FROM (countrylanguage cl1 JOIN country c1 ON cl1.CountryCode = c1.Code)
      LEFT JOIN ( (countrylanguage cl2 JOIN country c2 ON cl2.CountryCode = c2.Code)  
      ) ON cl1.Language = cl2.Language AND c2.Name = ${country2}
      WHERE c1.Name = ${country1} AND cl2.Language IS NULL;`,
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

app.get("/aggregateCountries", (req, res) => {
  const {agg_type, country_name} = req.query;
  aggregate_countries(agg_type, country_name)
  .then((result) => {
    res.send(result);
  }).catch((error) => {
    throw error;
  });

});

module.exports;
function aggregate_countries(agg_type, country_name) {

  return new Promise((resolve, reject) =>{
    pool.query(`SELECT Name, LifeExpectancy, GovernmentForm, Language FROM country, countrylanguage 
      WHERE LifeExpectancy > (SELECT ${agg_type}(LifeExpectancy) FROM country) 
      AND LifeExpectancy < (SELECT LifeExpectancy FROM country WHERE name=${country_name}) 
      AND countrylanguage.CountryCode=country.Code;`,
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
    )});

}


function find_min_max_continent() {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT Name, Continent, LifeExpectancy FROM country c1 WHERE LifeExpectancy
       = ANY (SELECT MIN(LifeExpectancy) FROM country c2 WHERE c1.Continent=c2.Continent GROUP BY Continent 
       UNION SELECT MAX(LifeExpectancy) FROM country c3 WHERE c1.Continent=c3.Continent GROUP BY Continent);`,
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
}

function find_country_languages(percentage, language) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT country.Name, Language, Percentage from countrylanguage, country 
        WHERE countrylanguage.CountryCode=country.Code AND Percentage>${percentage} 
        AND Language='${language}';`,
        (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        }
      );
    });
}

function find_country_count(amount) {

    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT c1.Name, c1.LifeExpectancy, c2.Continent FROM country c1 
        INNER JOIN (SELECT Continent, MAX(LifeExpectancy) AS LifeExpectancy FROM country 
        WHERE Name IN (SELECT country.Name FROM city, country WHERE city.CountryCode=country.Code 
        GROUP BY country.Name HAVING COUNT(city.Name) > ${amount}) GROUP BY Continent) 
        c2 ON c1.Continent = c2.Continent AND c1.LifeExpectancy = c2.LifeExpectancy;`,
        (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        }
      );
    });
}


app.listen(PORT, () => {
  console.log("Server started");
});

// contains("AFK", "countryCode", "city").then((result) => {
//   console.log(result);
// });

// find_min_max_continent().then(data => {
//   console.log(data);
// })

// find_country_languages(80, "German").then(data => {
//   console.log(data);
// })

find_country_count(100).then(data => {
  console.log(data);
})













