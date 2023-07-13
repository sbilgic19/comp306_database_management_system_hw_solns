async function getLifeExpectancy() {
  const agg_type = document.getElementById("selectBox").value;
  const country_name = document.getElementById("countryName").value;

  const url = `http://localhost:3000/aggregateCountries?agg_type=${agg_type}&country_name='${country_name}'`;
  const response = await fetch(url);
  const jsonData = await response.json();

  return jsonData;
  // const agg_type = document.getElementById("selectBox").value;
  // const country_name = document.getElementById("countryName").value;

  // fetch(`http://localhost:3000/aggregateCountries?agg_type=${agg_type}&country_name='${country_name}'`)
  // .then(data => {
  //   console.log(data);
  //   data = data.json();
  // }).then(result => {
  //   console.log(result);
  // }).catch(error => {
  //   console.error(error);
  // })
}


async function getDifferentLang() {
  const country1 = document.getElementById("country1").value;
  const country2 = document.getElementById("country2").value;

  const url = `http://localhost:3000/getDiffLang?country1='${country1}'&country2='${country2}'`;
  const response = await fetch(url);
  const jsonData = await response.json();
  return jsonData;

}

async function getDifferentLangJoin() {
  const country1 = document.getElementById("country1").value;
  const country2 = document.getElementById("country2").value;

  const url = `http://localhost:3000/getDiffLangJoin?country1='${country1}'&country2='${country2}'`;
  const response = await fetch(url);
  const jsonData = await response.json();
  return jsonData;

}

function clearTable() {

  var table = document.getElementById("resultTable");
  var rows = Array.from(table.rows);
  //console.log(`rows: ${rows}`);

  rows.forEach(row => {
    row.remove();
  })
  
}
function clearTableq4() {

  var tbody = document.getElementById("resBody");
  var rs = tbody.getElementsByTagName('tr');
  //var table = document.getElementsByTagName("resBody");
  //rs = rs.item;
  
  //console.log(rs.length);
  var rows = Array.from(rs);
  console.log(`row length: ${rows.length}`);
  // for(i in rows){
  //   console.log(`i in rs: ${i}`);
  // }
  //console.log(rs.item());
  // var rows = Array.from(rs);

  rows.forEach(row => {
    row.remove();
  })
  
}

function getDiffLangTable() {

  clearTable();
  var table = document.getElementById("resultTable");
  getDifferentLang().then((jsonData) => {
    for (var i = 0; i < jsonData.length; i++) {
      var row = table.insertRow(i);
      var cell = row.insertCell();
      
      cell.innerHTML = jsonData[i].Language;
  
  }});
}

function getDiffLangJoinTable() {

  clearTable();
  var table = document.getElementById("resultTable");
  getDifferentLangJoin().then((jsonData) => {
    for (var i = 0; i < jsonData.length; i++) {
      var row = table.insertRow(i);
      var cell = row.insertCell();
      
      cell.innerHTML = jsonData[i].Language;
  
  }});
}

function getLifeExpectancyTable() {
  
  //clearTable();
  clearTableq4();
  var tbody = document.getElementById("resBody");
  getLifeExpectancy().then((jsonData) => {
    for (var i = 0; i < jsonData.length; i++) {
      var row = tbody.insertRow();
      var nameCell = row.insertCell(0);
      var lifeExpCell = row.insertCell(1);
      var governmentForm = row.insertCell(2);
      var languageCell = row.insertCell(3);

      nameCell.innerHTML = jsonData[i].Name;
      lifeExpCell.innerHTML = jsonData[i].LifeExpectancy;
      governmentForm.innerHTML = jsonData[i].GovernmentForm;
      languageCell.innerHTML = jsonData[i].Language;


      
  }});
}
