let groupsData;


let currentURL = new URL(window.location.href);
let pageNum = currentURL.searchParams.get('page') ? currentURL.searchParams.get('page') : 1;



let baseURL = 'https://test-delirium.hellishworld.ru';
let paramsURL = new URLSearchParams({
  page: pageNum
});


fetch(`${baseURL}/api/fraction?${paramsURL}`)
  .then(response => {
    if (!response.ok) throw new Error(response.status);
    return response.json();
  })
  .then(data => {
    groupsData = data.data;
    console.log(data);
    createCards();
    createPagination(data.meta.current_page, data.meta.last_page);
  })
  .catch(err => {
    console.error('Ошибка ', err);
  })


function createCards() {
  let groupsCardsContainer = document.querySelector('.groups-container');
  groupsCardsContainer.innerHTML = '';

  for (let groupsDataItem of groupsData) {
    appendCard(groupsCardsContainer, groupsDataItem);
  }
}



function appendCard(container, groupsDataItem) {
  let groupsCard = document.createElement('div');
  groupsCard.classList.add('groups-card');

  
  let cardHeader = document.createElement('div');
  cardHeader.classList.add('card-header');

  let image = document.createElement('div');
  image.classList.add('groups-image');
  let img = document.createElement('img');
  img.setAttribute('src', groupsDataItem.icon_url);
  image.appendChild(img);
  cardHeader.appendChild(image);

  let cardTitle = document.createElement('div');
  cardTitle.classList.add('card-title');
  cardTitle.innerText = groupsDataItem.title;
  cardHeader.appendChild(cardTitle);

  let colorMark = document.createElement('div');
  colorMark.classList.add('color-mark');
  colorMark.style.backgroundColor = 'rgb(' + groupsDataItem.color + ')';
  cardHeader.appendChild(colorMark);

  groupsCard.appendChild(cardHeader);

  let characteristicsContainer = document.createElement('div');
  characteristicsContainer.classList.add('characteristics-container');
  appendCharacteristic(characteristicsContainer, 'bank', 'Банк', groupsDataItem.bank);
  appendCharacteristic(characteristicsContainer, 'experience', 'Опыт', groupsDataItem.experience);
  appendCharacteristic(characteristicsContainer, 'areas', 'Территории', groupsDataItem.gangzones_count);
  appendCharacteristic(characteristicsContainer, 'players', 'Количество игроков', groupsDataItem.players_count);
  groupsCard.appendChild(characteristicsContainer);

  container.appendChild(groupsCard);
}



function appendCharacteristic(container, className, titleText, valueText) {
  let characteristic = document.createElement('div');
  characteristic.classList.add('characteristic', className);
  let spanTitle = document.createElement('span');
  spanTitle.classList.add('text', 'title');
  spanTitle.innerText = titleText;
  characteristic.appendChild(spanTitle);
  let spanText = document.createElement('span');
  spanText.classList.add('text', 'value');
  spanText.innerText = valueText;
  characteristic.appendChild(spanText);
  container.appendChild(characteristic);
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