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

      optionData += res.map((states) => {
        return `<option value=${states.sigla}>${states.nome}</option>`;
      });

      var optionState = document.querySelector("#states");
      optionState.innerHTML = optionData;

      optionState.addEventListener("change", function (e) {
        e.preventDefault();
        if (optionState != "") {
          covidStateSearch(optionState.value);
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
      console.log("Casos: " + res.cases.toLocaleString("pt-BR"));
      console.log("Mortes: " + res.deaths.toLocaleString("pt-BR"));
      console.log("Suspeitos: " + res.suspects.toLocaleString("pt-BR"));
      console.log("Data: " + convertDate(res.datetime));
    })
    .catch(function (error) {
      console.log(error);
    });
}

function convertDate(date) {
  var data = new Date(date);
  var day = data.getDate().toString();
  var dayRes = day.length === 1 ? "0" + day : day;
  var month = data.getMonth().toString() + 1;
  var monthRes = month.length === 1 ? "0" + month : month;

  var year = data.getFullYear();
  data = dayRes + "/" + monthRes + "/" + year;
  
  return data;
}
