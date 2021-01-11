// window.onload() = function() {
//    stateSearch();
// }

async function requestApi(url,option) {
  const response = await axios(url,option);

  return response.data;

}


// function requestApiCovid(state) {
//  const request = requestApi(`https://covid19-brazil-api.now.sh/api/report/v1/brazil/uf/${state}`);

//   return request;
// }


function stateSearch() {
  
 var url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados`;

 const request = requestApi(url);

 request.then((res) => {
  var optionData = `<option value="" selected>Selecione um estado</option>`

  optionData+= res.map(states =>{
    return `<option value=${states.sigla}>${states.nome}</option>`
  })

  var optionState = document.querySelector("#states");
  optionState.innerHTML = optionData;


  

  console.log(optionData);
 })

}

stateSearch();

