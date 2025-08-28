let transportData;

let radioButtons = document.querySelectorAll('.s-tab .input-radio');

radioButtons.forEach(radioButton => {
  radioButton.addEventListener('change', () => {
    if (radioButton.checked) {
      let value = radioButton.value;
      createTransportCards(value);
    }
  });
})





let currentURL = new URL(window.location.href);
let pageNum = currentURL.searchParams.get('page') ? currentURL.searchParams.get('page') : 1;



let baseURL = 'https://test-delirium.hellishworld.ru';
let paramsURL = new URLSearchParams({
  page: pageNum
});


fetch(`${baseURL}/api/vehicle?${paramsURL}`)
  .then(response => {
    if (!response.ok) throw new Error(response.status);
    return response.json();
  })
  .then(data => {
    transportData = data.data;
    console.log(data);
    createTransportCards('all');
    createPagination(data.meta.current_page, data.meta.last_page);
  })
  .catch(err => {
    console.error('Ошибка ', err);
  })


function createTransportCards(filter) {
  let transportCardsContainer = document.querySelector('.transport-container');
  transportCardsContainer.innerHTML = '';

  for (let transportDataItem of transportData) {
    if (filter === 'all' || transportTypesEnum[transportDataItem.type] === filter)
    appendTransportCard(transportCardsContainer, transportDataItem);
  }
}


// УЗНАТЬ
let transportTypesEnum = {
  0: 'plain-or-helicopter',
  1: '',
  2: 'motocycle',
  3: 'truck',
  4: '',
  5: 'trailer',
  6: '',
  7: 'car'
}



function appendTransportCard(container, transportDataItem) {
  let transportCard = document.createElement('div');
  transportCard.classList.add('transport-card', transportTypesEnum[transportDataItem.type]);

  let image = document.createElement('div');
  image.classList.add('transport-image');
  let img = document.createElement('img');
  img.setAttribute('src', transportDataItem.model_url);
  image.appendChild(img);
  transportCard.appendChild(image);

  let characteristicsContainer = document.createElement('div');
  characteristicsContainer.classList.add('characteristics-container');
  appendCharacteristic(characteristicsContainer, 'name', 'Наименование', transportDataItem.title);
  appendCharacteristic(characteristicsContainer, 'volume', 'Вместимость багажника', transportDataItem.tank_size + ' кг');
  appendCharacteristic(characteristicsContainer, 'speed', 'Скорость', transportDataItem.speed + ' км/ч');
  appendCharacteristic(characteristicsContainer, 'num', 'Количество', transportDataItem.count + ' шт');
  appendCharacteristic(characteristicsContainer, 'cost', 'Стоимость ключа', '$' + transportDataItem.price);
  transportCard.appendChild(characteristicsContainer);

  container.appendChild(transportCard);
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