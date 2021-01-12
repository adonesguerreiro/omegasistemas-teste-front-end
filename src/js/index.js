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
      optionData += res.data.map((states) => {
        return `<option value=${states.sigla}>${states.nome}</option>`;
      });

      var buttonState = document.querySelector("#covidsearch");

      var optionState = document.querySelector("#covidstates");
      optionState.innerHTML = optionData;

      buttonState.addEventListener("click", function (e) {
        e.preventDefault();
        if (optionState.value != "") {
          covidStateSearch(optionState.value);
        } else {
          alert("Deve selecionar um estado antes de prosseguir");
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
      ${img}
     <p>Estado: ${res.data.state.toLocaleString("pt-BR")}</p>
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

  var modal = document.querySelector("#modal");
  modal.style.display = "block";
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
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
