window.onload = function () {
  stateSearch();
};

async function requestApi(url, option) {
  const response = await axios(url, option);

  return response;
}

const testeDados = {
  data: [
    {
      "uid": 35,
      "uf": "SP",
      "state": "São Paulo",
      "cases": 154,
      "deaths": 4,
      "suspects": 5,
      "refuses": 596,
      "datetime": "2021-01-09T23:06:21.561Z"
    },
    {
      "uid": 31,
      "uf": "MG",
      "state": "Minas Gerais",
      "cases": 587868,
      "deaths": 12594,
      "suspects": 925,
      "refuses": 104,
      "datetime": "2021-01-09T23:06:21.561Z"
    },
    {
      "uid": 42,
      "uf": "SC",
      "state": "Santa Catarina",
      "cases": 518805,
      "deaths": 5611,
      "suspects": 346,
      "refuses": 47,
      "datetime": "2021-01-09T23:06:21.561Z"
    },
    {
      "uid": 29,
      "uf": "BA",
      "state": "Bahia",
      "cases": 511192,
      "deaths": 9392,
      "suspects": 573,
      "refuses": 36,
      "datetime": "2021-01-09T23:06:21.561Z"
    },
  ]
}

function stateSearch() {
  var url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados`;

  const request = requestApi(url);

  request
    .then((res) => {
      var optionData = `<option value="" selected>Selecione um estado</option>`;
      var optionAll = `<option value="todos">Todos</option>`;
      optionData += optionAll;
      optionData += res.data.map((states) => {
        return `<option value=${states.sigla}>${states.nome}</option>`;
      });

      var buttonState = document.querySelector("#search");
      var optionState = document.querySelector("#covidstates");
      optionState.innerHTML = optionData;

      buttonState.addEventListener("click", function (e) {
        e.preventDefault();
        if (optionState.value != "" && optionState.value != "todos") {
          covidStateSearch(optionState.value);
        } else if (optionState.value === "todos") {
          covidStateSearchStatus();
        }
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}

function covidStateSearch(state) {
  var url = `https://covid19-brazil-api.now.sh/api/report/v1/brazil/uf/${state}`;
  var img = covidStateFlag(state);
  const request = requestApi(url);

  request
    .then((res) => {
      
      


      console.log(res);
      console.log("Casos: " + res.data.cases.toLocaleString("pt-BR"));
      console.log("Mortes: " + res.data.deaths.toLocaleString("pt-BR"));
      console.log("Suspeitos: " + res.data.suspects.toLocaleString("pt-BR"));
      console.log("Data: " + convertDateTime(res.data.datetime));
    })
    .catch(function (error) {
      console.log(error);
    });
}

function covidStateSearchStatus() {
  // var url = `https://covid19-brazil-api.now.sh/api/report/v1/`;

  // const request = requestApi(url);
  // var dataCovid;
  // dataCovid = request
  //   .then((res) => console.log(res.data))
  //   .catch(function (error) {
  //     console.log(error);
  //   });


  console.log(testeDados.data);
  var max = testeDados.reduce((a) => {
    return console.log(Math.max(a));
  });

    // console.log(dataCovid);

}

function covidStateFlag(uf) {
  var url = `https://devarthurribeiro.github.io/covid19-brazil-api/static/flags/${uf}.png`;

   var img = `<img src=${url} >`;

   return img;
}




function convertDateTime(date) {
  var data = new Date(date);
  var day = data.getDate().toString();
  var dayRes = day.length === 1 ? "0" + day : day;
  var month = data.getMonth().toString() + 1;
  var monthRes = month.length === 1 ? "0" + month : month;

  var seconds = data.getSeconds().toString();
  var secondsRes = seconds.length === 1 ? "0" + seconds : seconds;
  var minutes = data.getMinutes().toString();
  var minutesRes = minutes.length === 1 ? "0" + minutes : minutes;
  var hour = data.getHours();

  var year = data.getFullYear();
  data =
    dayRes +
    "/" +
    monthRes +
    "/" +
    year +
    " às " +
    hour +
    ":" +
    minutesRes +
    ":" +
    secondsRes;

  return data;
}
