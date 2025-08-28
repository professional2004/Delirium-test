let traderData;


let currentURL = new URL(window.location.href);
let pageNum = currentURL.searchParams.get('page') ? currentURL.searchParams.get('page') : 1;



let baseURL = 'https://test-delirium.hellishworld.ru';
let paramsURL = new URLSearchParams({
  page: pageNum
});


fetch(`${baseURL}/api/trader?${paramsURL}`)
  .then(response => {
    if (!response.ok) throw new Error(response.status);
    return response.json();
  })
  .then(data => {
    traderData = data.data;
    console.log(data);
    createCards();
    createPagination(data.meta.current_page, data.meta.last_page);
  })
  .catch(err => {
    console.error('Ошибка ', err);
  })


function createCards() {
  let traderCardsContainer = document.querySelector('.trader-container');
  traderCardsContainer.innerHTML = '';

  for (let traderDataItem of traderData) {
    appendCard(traderCardsContainer, traderDataItem);
  }
}




function appendCard(container, traderDataItem) {
  let traderCard = document.createElement('div');
  traderCard.classList.add('trader-card');

  let titleBlock = document.createElement('div');
  titleBlock.classList.add('title-block');

  let image = document.createElement('div');
  image.classList.add('image');
  let img = document.createElement('img');
  img.setAttribute('src', traderDataItem.skin_url);
  image.appendChild(img);
  titleBlock.appendChild(image);

  let title = document.createElement('div');
  title.classList.add('title');
  title.innerText = traderDataItem.name;
  titleBlock.appendChild(title);

  let coords = document.createElement('div');
  coords.classList.add('coords');
  coords.innerText = traderDataItem.position.x + ', ' + traderDataItem.position.y + ', ' + traderDataItem.position.z;
  titleBlock.appendChild(coords);
  traderCard.appendChild(titleBlock);

  let type = document.createElement('div');
  type.classList.add('type');
  type.innerText = traderDataItem.title;
  traderCard.appendChild(type);

  let itemsToBuyNum = 0;
  let itemsToSellNum = 0;
  for (let item of traderDataItem.items) {
    if (item.price !== 0) itemsToBuyNum++;
    if (item.price_sell !== 0) itemsToSellNum++;
  }
  let itemsToBuy = document.createElement('div');
  itemsToBuy.classList.add('items-to-buy');
  itemsToBuy.innerText = 'Продает ' + itemsToBuyNum + ' товаров, скупает ' + itemsToSellNum + ' товаров';
  traderCard.appendChild(itemsToBuy);


  container.appendChild(traderCard);
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







