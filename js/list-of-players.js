let tablePlayers = document.querySelector('.players-display');

let controlTab = document.querySelector('.s-tab');
let radioButtons = controlTab.querySelectorAll('.input-radio');
let radioSelects = controlTab.querySelectorAll('.tab-radio .tab-radio-select');
let sectionTitle = document.querySelector('.c-section-title');

radioButtons.forEach(radioButton => {
  radioButton.addEventListener('change', () => {
    if (radioButton.checked) {
      let value = radioButton.getAttribute('value');

      if (value === 'select') {
        let select = controlTab.querySelector(`.tab-radio.select[for="${radioButton.getAttribute('id')}"]`);
        let option = select.querySelector('.select-option.selected');
        value = option.getAttribute('data-value');
      }

      sectionTitle.innerText = tableStructure[value].title.toUpperCase();
      loadPlayers(tablePlayers, tableStructure[value], playersData);
    }
  })
})

radioSelects.forEach(radioSelect => {
  radioSelect.addEventListener('selectChange', () => {
    let option = radioSelect.querySelector('.select-option.selected');
    let newValue = option.getAttribute('data-value');
    sectionTitle.innerText = tableStructure[newValue].title.toUpperCase();
    loadPlayers(tablePlayers, tableStructure[newValue], playersData);
  })  
})





let currentURL = new URL(window.location.href);
let pageNum = currentURL.searchParams.get('page') ? currentURL.searchParams.get('page') : 1;

let playersData;


let baseURL = 'https://test-delirium.hellishworld.ru';
let paramsURL = new URLSearchParams({
  page: pageNum
});

fetch(`${baseURL}/api/player?${paramsURL}`)
  .then(response => {
    if (!response.ok) throw new Error(response.status);
    return response.json();
  })
  .then(data => {
    playersData = data.data;
    console.log(data);
    loadPlayers(tablePlayers, tableStructure.players, data.data);
    createPagination(data.meta.current_page, data.meta.last_page);
  })
  .catch(err => {
    console.error('Ошибка ', err);
  })







// ПРОВЕРИТЬ ПАРАМЕТРЫ!
let tableStructure = {

  players: {
    title: 'Игроки',
    playerParams: [
      { typeName: 'online', valueName: 'is_online', headerName: 'Онлайн' },
      { typeName: 'text', valueName: 'login', headerName: 'Ник' },
      { typeName: 'text', valueName: 'leave_time', headerName: 'Активность' },
      { typeName: 'text', valueName: 'pvp_score', headerName: 'Уровень' },
      { typeName: 'text', valueName: 'bleeding', headerName: 'Группировка' },
      { typeName: 'text', valueName: 'swags_found', headerName: 'Ранг' },
      { typeName: 'text', valueName: 'humanity', headerName: 'Человечность' },
      { typeName: 'text', valueName: 'poison', headerName: 'Заточение' }
    ]
  },

  total_time: {
    title: 'Общее время',
    playerParams: [
      { typeName: 'number', valueName: '', headerName: '' },
      { typeName: 'nickname', valueName: 'login', headerName: 'Игрок' },
      { typeName: 'text', valueName: 'total_alife', headerName: 'Время' }
    ]
  },

  current_time: {
    title: 'Текущее время',
    playerParams: [
      { typeName: 'number', valueName: '', headerName: '' },
      { typeName: 'nickname', valueName: 'login', headerName: 'Игрок' },
      { typeName: 'text', valueName: 'total_survival_time', headerName: 'Уровень' }
    ]
  },

  one_life_time: {
    title: 'Время одной жизни',
    playerParams: [
      { typeName: 'number', valueName: '', headerName: '' },
      { typeName: 'nickname', valueName: 'login', headerName: 'Игрок' },
      { typeName: 'text', valueName: 'total_survival_time', headerName: 'Время' }
    ]
  },

  hits: {
    title: 'Попадания',
    playerParams: [
      { typeName: 'number', valueName: '', headerName: '' },
      { typeName: 'nickname', valueName: 'login', headerName: 'Игрок' },
      { typeName: 'text', valueName: 'hits', headerName: 'Попадания' }
    ]
  },

  headshots: {
    title: 'Попадания в голову',
    playerParams: [
      { typeName: 'number', valueName: '', headerName: '' },
      { typeName: 'nickname', valueName: 'login', headerName: 'Игрок' },
      { typeName: 'text', valueName: 'headshots', headerName: 'Попадания в голову' }
    ]
  },

  kills: {
    title: 'Убийства',
    playerParams: [
      { typeName: 'number', valueName: '', headerName: '' },
      { typeName: 'nickname', valueName: 'login', headerName: 'Игрок' },
      { typeName: 'text', valueName: 'players_killed', headerName: 'Убийства' }
    ]
  },

  pvp_wins: {
    title: 'Победы на PVP-арене',
    playerParams: [
      { typeName: 'number', valueName: '', headerName: '' },
      { typeName: 'nickname', valueName: 'login', headerName: 'Игрок' },
      { typeName: 'text', valueName: 'pvp_score', headerName: 'Победы на PVP-арене' }
    ]
  },

  score: {
    title: 'Рейтинг',
    playerParams: [
      { typeName: 'number', valueName: '', headerName: '' },
      { typeName: 'nickname', valueName: 'login', headerName: 'Игрок' },
      { typeName: 'text', valueName: 'experience', headerName: 'Опыт' },
      { typeName: 'text', valueName: 'ice', headerName: 'Уровень' }
    ]
  },

  money: {
    title: 'Деньги',
    playerParams: [
      { typeName: 'number', valueName: '', headerName: '' },
      { typeName: 'nickname', valueName: 'login', headerName: 'Игрок' },
      { typeName: 'text', valueName: 'money', headerName: 'Количество денег' }
    ]
  },

  walked: {
    title: 'Пройдено пешком',
    playerParams: [
      { typeName: 'number', valueName: '', headerName: '' },
      { typeName: 'nickname', valueName: 'login', headerName: 'Игрок' },
      { typeName: 'text', valueName: 'walked', headerName: 'Пройдено пешком' }
    ]
  },

  driven: {
    title: 'Пройдено на транспорте',
    playerParams: [
      { typeName: 'number', valueName: '', headerName: '' },
      { typeName: 'nickname', valueName: 'login', headerName: 'Игрок' },
      { typeName: 'text', valueName: 'driven', headerName: 'Пройдено на транспорте' }
    ]
  }
}





// создать таблицу
function loadPlayers(container, content, players) {
  container.innerHTML = '';
  let headerNames = content.playerParams.map(param => param.headerName);
  appendHeaderRow(container, headerNames);

  for (let player of players) {
    let row = document.createElement('tr');
    row.classList.add('row', 'player');

    for (let param of content.playerParams) {
      appendTableColumn(row, param.typeName, player[param.valueName], players.indexOf(player) + 1);
    }
    container.appendChild(row);
  }
}


// добавить ячейку
function appendTableColumn(container, type, value, index) {
  let column = document.createElement('td');
  column.classList.add('column');

  if (type === 'online') {
    let isOnlineElem = document.createElement('span');
    isOnlineElem.classList.add('is-online');
    if (value) {
      isOnlineElem.classList.add('online');
    }
    column.appendChild(isOnlineElem);

  } else if (type === 'nickname') {
    column.classList.add('nickname');
    column.innerText = value;
    
    
  } else if (type === 'number') {
    column.innerText = index;
    
  } else if (type === 'text') {
    column.innerText = value;
  }

  container.appendChild(column);
}


// добавить строку заголовка 
function appendHeaderRow(tableContainer, columnNames) {  
  let rowHeader = document.createElement('tr');
  rowHeader.classList.add('row', 'header');

  for (let columnName of columnNames) {
    let column = document.createElement('td');
    column.classList.add('column');
    column.innerText = columnName;
    rowHeader.appendChild(column);    
  }
  tableContainer.appendChild(rowHeader);
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





