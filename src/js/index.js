window.onload = function () {
  stateSearch();
};

async function requestApi(url, option) {
  const response = await axios(url, option);

  return response.data;
}

function stateSearch() {
  var url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados`;

  const request = requestApi(url);

  request
    .then((res) => {
      var optionData = `<option value="" selected>Selecione um estado</option>`;
      optionData += optionAll;
      optionData += res.map((states) => {
        return `<option value=${states.sigla}>${states.nome}</option>`;
      });
      
      var optionAll = `<option value="todos">Todos</option>`;
      var optionState = document.querySelector("#states");
      optionState.innerHTML = optionData;

      optionState.addEventListener("change", function (e) {
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
  const request = requestApi(url);

  request
    .then((res) => {
      console.log(res);
      console.log("Casos: " + res.cases.toLocaleString("pt-BR"));
      console.log("Mortes: " + res.deaths.toLocaleString("pt-BR"));
      console.log("Suspeitos: " + res.suspects.toLocaleString("pt-BR"));
      console.log("Data: " + convertDateTime(res.datetime));
    })
    .catch(function (error) {
      console.log(error);
    });
}

function covidStateSearchStatus() {
  var url = `https://covid19-brazil-api.now.sh/api/report/v1/`;
  const request = requestApi(url);
  var data;
  request
    .then((res) => {
      data = res.data.map((status) => {
        var dataStatus = [
          {
            
            state: status.state,
            cases: status.cases,
            deaths: status.deaths,
            suspects: status.suspects,
            uid: status.uid,
            uf: status.uf,
          },
        ]
     
        return console.log(dataStatus[0].cases);
        
      });
     

    })
    .catch(function (error) {
      console.log(error);
    });
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
    " as " +
    hour +
    ":" +
    minutesRes +
    ":" +
    secondsRes;

  return data;
}
