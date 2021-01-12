window.onload = function () {
  stateSearch();
};

async function requestApi(url, option) {
  const response = await axios(url, option);

  return response;
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

      var buttonState = document.querySelector("#covidsearch");
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

  var modalCovid = document.querySelector("#modal");
  request
    .then((res) => {
      var modal = `
      <div class="covid-modal">
      <span class="covid-close">&times;</span>
       ${img}
      <p>Casos: ${res.data.cases.toLocaleString("pt-BR")}</p>
      <p>Mortes: ${res.data.deaths.toLocaleString("pt-BR")}</p>
      <p>Suspeitos: ${res.data.suspects.toLocaleString("pt-BR")}</p>
      <p>Última Atualização: ${convertDateTime(res.data.datetime)}</p>
     </div>`;
     modalCovid.innerHTML = modal;
    })
    .catch(function (error) {
      console.log(error);
    });

  
    modalCovid = document.querySelector('#modal');
    modal.style.display = 'flex';
    var btnClose = document.querySelector('.covid-close');

    btnClose.addEventListener("click", function (event) {
      event.preventDefault();
      modal.style.display = 'none';
    });

   

}

function covidStateSearchStatus() {
  var url = `https://covid19-brazil-api.now.sh/api/report/v1/`;
  const request = requestApi(url);

  let dataCovid = {
    caso: {
      estado: "",
      quantidade: 0,
    },
    suspeito: {
      estado: "",
      quantidade: 0,
    },
    mortos: {
      estado: "",
      quantidade: 0,
    },
  };

  request.then((res) => {
    res.data
      .map((covid) => {
        if (dataCovid.caso.quantidade < covid.cases) {
          dataCovid.caso.estado = covid.state;
          dataCovid.caso.quantidade = covid.cases;
        }
        if (dataCovid.suspeito.quantidade < covid.suspects) {
          dataCovid.suspeito.estado = covid.state;
          dataCovid.suspeito.quantidade = covid.suspects;
        }
        if (dataCovid.mortos.quantidade < covid.deaths) {
          dataCovid.mortos.estado = covid.state;
          dataCovid.mortos.quantidade = covid.deaths;
        }

        console.log("covid:" + dataCovid);
      })
      .catch(function (error) {
        console.log(error);
      });
  });

}
function covidStateFlag(uf) {
  var url = `https://devarthurribeiro.github.io/covid19-brazil-api/static/flags/${uf}.png`;

  var img = `<img src=${url} id="covid-flag">`;

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
