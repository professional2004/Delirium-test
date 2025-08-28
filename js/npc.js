let npcData;


let currentURL = new URL(window.location.href);
let pageNum = currentURL.searchParams.get('page') ? currentURL.searchParams.get('page') : 1;



let baseURL = 'https://test-delirium.hellishworld.ru';
let paramsURL = new URLSearchParams({
  page: pageNum
});


fetch(`${baseURL}/api/quest/character?${paramsURL}`)
  .then(response => {
    if (!response.ok) throw new Error(response.status);
    return response.json();
  })
  .then(data => {
    npcData = data.data;
    console.log(data);
    createCards();
    createPagination(data.meta.current_page, data.meta.last_page);
  })
  .catch(err => {
    console.error('Ошибка ', err);
  })


function createCards() {
  let npcCardsContainer = document.querySelector('.npc-container');
  npcCardsContainer.innerHTML = '';

  for (let npcDataItem of npcData) {
    appendCard(npcCardsContainer, npcDataItem);
  }
}



function appendCard(container, npcDataItem) {
  let npcCard = document.createElement('div');
  npcCard.classList.add('npc-card');

  let titleBlock = document.createElement('div');
  titleBlock.classList.add('title-block');

  let image = document.createElement('div');
  image.classList.add('image');
  let img = document.createElement('img');
  img.setAttribute('src', npcDataItem.skin_url);
  image.appendChild(img);
  titleBlock.appendChild(image);

  let title = document.createElement('div');
  title.classList.add('title');
  title.innerText = npcDataItem.name;
  titleBlock.appendChild(title);

  let coords = document.createElement('div');
  coords.classList.add('coords');
  coords.innerText = npcDataItem.position.x + ', ' + npcDataItem.position.y + ', ' + npcDataItem.position.z;
  titleBlock.appendChild(coords);
  npcCard.appendChild(titleBlock);

  let description = document.createElement('div');
  description.classList.add('description');
  description.innerText = 'Квестовый персонаж с ' + npcDataItem.quests.length + ' квестами';
  npcCard.appendChild(description);


  container.appendChild(npcCard);
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





