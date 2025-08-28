let thingsData;


let currentURL = new URL(window.location.href);
let pageNum = currentURL.searchParams.get('page') ? currentURL.searchParams.get('page') : 1;



let baseURL = 'https://test-delirium.hellishworld.ru';
let paramsURL = new URLSearchParams({
  page: pageNum
});


fetch(`${baseURL}/api/item?${paramsURL}`)
  .then(response => {
    if (!response.ok) throw new Error(response.status);
    return response.json();
  })
  .then(data => {
    thingsData = data.data;
    console.log(data);
    createCards();
    createPagination(data.meta.current_page, data.meta.last_page);
  })
  .catch(err => {
    console.error('Ошибка ', err);
  })


function createCards() {
  let thingsCardsContainer = document.querySelector('.things-container');
  thingsCardsContainer.innerHTML = '';

  for (let thingsDataItem of thingsData) {
    appendCard(thingsCardsContainer, thingsDataItem);
  }
}

let types = {
  WP_MELEE: 'Оружие ближнего боя',
  MATHERIAL: 'Материалы',
  USABLE: 'Расходники',
  CLOTH: 'Одежда',
  WP_ADDIT: 'Дополнительное оружие',
  WP_MAIN: 'Основное оружие',
  TOOL: 'Инструменты',
  AMMO: 'Боеприпасы',
  DRUG: 'Медикаменты',
  FOOD: 'Еда и напитки',
  WEAPON: 'Оружие',
  WP_SIDE: 'Побочное оружие',
  ARMOUR: 'Броня',
  HELM: 'Шлемы',
  RADIO: 'Радио',
  ARTEFACT: 'Артефакты',
  ACCESSORY: 'Аксессуары',
  VEH_P_INDP: 'Запчасти (Независимые)',
  VEH_P_DETAIL: 'Запчасти (Детали)',
  VEH_P_CPLX: 'Запчасти (Комплексные)'
}


function appendCard(container, thingsDataItem) {
  let thingsCard = document.createElement('div');
  thingsCard.classList.add('things-card');

  let image = document.createElement('div');
  image.classList.add('things-image');
  let img = document.createElement('img');
  img.setAttribute('src', thingsDataItem.image);
  image.appendChild(img);
  thingsCard.appendChild(image);

  let cardTitle = document.createElement('span');
  cardTitle.classList.add('card-title');
  cardTitle.innerText = thingsDataItem.title;
  thingsCard.appendChild(cardTitle);

  let cardType = document.createElement('span');
  cardType.classList.add('card-type');
  let type = types[thingsDataItem.type] ? types[thingsDataItem.type] : 'Другое';
  cardType.innerText = type;
  thingsCard.appendChild(cardType);

  let cardWeight = document.createElement('span');
  cardWeight.classList.add('card-weight');
  cardWeight.innerText = 'Вес: ' + thingsDataItem.weight + ' кг';
  thingsCard.appendChild(cardWeight);

  container.appendChild(thingsCard);
}







function createPagination(currentPage, lastPage) {
  if (lastPage !== 1) {
    let pageNumsContainer = document.querySelector('.page-navigation');

    let maxNumbers = 3;

    // left part
    if (currentPage > 1 && currentPage <= maxNumbers + 2) {
      for (let i = 1; i < currentPage; i++) {
        appendPaginationButton(pageNumsContainer, i, false);
      }
    } else if (currentPage > maxNumbers + 2) {
      appendPaginationButton(pageNumsContainer, 1, false);
      appendPaginationThreeDots(pageNumsContainer);
      for (let i = currentPage - maxNumbers; i < currentPage; i++) {
        appendPaginationButton(pageNumsContainer, i, false);
      }
    }

    // center part
    appendPaginationButton(pageNumsContainer, currentPage, true);

    // right part
    if (lastPage - currentPage > 0 && lastPage - currentPage <= maxNumbers + 2) {
      for (let i = currentPage + 1; i <= lastPage; i++) {
        appendPaginationButton(pageNumsContainer, i, false);
      }
    } else if (lastPage - currentPage > maxNumbers + 2) {
      for (let i = currentPage + 1; i <= currentPage + maxNumbers + 1; i++) {
        appendPaginationButton(pageNumsContainer, i, false);
      }
      appendPaginationThreeDots(pageNumsContainer);
      appendPaginationButton(pageNumsContainer, lastPage, false);
    }    
  }

}



function appendPaginationButton(container, num, isThis) {
  let buttonURL = new URL(currentURL);

  if (buttonURL.searchParams.get('page')) {
    buttonURL.searchParams.set('page', num);
  } else {
    buttonURL.searchParams.append('page', num);
  }

  let pageButton = document.createElement('a');
  pageButton.classList.add('page-nav');
  pageButton.setAttribute('href', buttonURL);
  if (isThis) { 
    pageButton.classList.add('this'); 
  }
  pageButton.innerText = num;
  container.appendChild(pageButton);
}

function appendPaginationThreeDots(container) {
  let threeDots = document.createElement('span');
  threeDots.classList.add('dot-dot-dot');
  threeDots.innerText = '...';
  container.appendChild(threeDots);
}