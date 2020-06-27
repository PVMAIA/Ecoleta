function popularUFs() {
    const ufSelect = document.querySelector("select[name=uf]");
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
        .then(res => res.json())
        .then(states => {
            for (const state of states) {
                ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`;
            }
        });
}

popularUFs();

function getCities(event) {
    const citySelect = document.querySelector("select[name=city]");
    const stateInput = document.querySelector("input[name=state]");

    const ufValue = event.target.value;

    const indexOfSelectState = event.target.selectedIndex;
    stateInput.value = event.target.options[indexOfSelectState].text;

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`;

    citySelect.innerHTML = "<option value>Selecione a Cidade</option>";
    citySelect.disabled = true;

    fetch(url)
        .then(res => res.json())
        .then(cities => {
            for (const city of cities) {
                citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`;
            }
            
            citySelect.disabled = false;
        });
}

document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities);

// Itens de coleta
// Pegar todos os li's
const itemsToCollect = document.querySelectorAll(".items-grid li");

for (const item of itemsToCollect) {
    item.addEventListener("click", handleSelectedItem);
}
 
const collectedItems = document.querySelector("input[name=items]");

let selectedItems = [];

function handleSelectedItem(event) {

    const itemLi = event.target;

    // Adicionar ou remover um classe com js
    itemLi.classList.toggle("selected");
    
    const itemId = itemLi.dataset.id;

    // Verificar se existem items selecionados
    // Se tiver, tem que pegar os items selecionados

    const alreadySelected = selectedItems.findIndex( item => item == itemId); 
    // item == itemId será true ou false

    // Se já estiver selecionado
    if(alreadySelected >= 0) {
        //tirar da seleção
        const filterItems = selectedItems.filter(item => item != itemId);

        selectedItems = filterItems;
    } else {
        //Atualizar o campo escondido com os itens selecionados
        //adiconar a seleção
        selectedItems.push(itemId);
    }

    //Atualizar o campo escondido com os itens selecionados
    collectedItems.value = selectedItems;
    
}