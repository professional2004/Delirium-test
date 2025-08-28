// map

let map_element = document.getElementById('id--map');
let mapViewbox = map_element.querySelector('.map-viewbox');
let mapContent = map_element.querySelector('.map-content');

let minimapWrapper = map_element.querySelector('.minimap-block');
let minimap = minimapWrapper.querySelector('.minimap');
let minimapViewbox = minimapWrapper.querySelector('.minimap-viewbox');

let mapScaleButtonMore = map_element.querySelector('.scale-buttons-block .scale-button.more');
let mapScaleButtonScale = map_element.querySelector('.scale-buttons-block .scale-button.scale');
let mapScaleButtonLess = map_element.querySelector('.scale-buttons-block .scale-button.less');

mapScaleButtonMore.addEventListener('click', () => {
  zoomMap('zoom-in');
})

mapScaleButtonLess.addEventListener('click', () => {
  zoomMap('zoom-out');
})

mapScaleButtonScale.addEventListener('click', () => {
  zoomMap('zoom-to-center');
})

let map = {
  name: 'map',
  w: 0, // map width
  h: 0, // map height
  vw: 0, // viewbox width
  vh: 0, // viewbox height
  x: 0, // координата x центра viewbox относительно центра map
  y: 0, // координата y центра viewbox относительно центра map
  z: 1, // масштабирование карты (ширина viewbox / ширина map)
  miniw: 0, // ширина миникарты
  zoom_step: 1.5,
  zoom_start: 1,
  zoom_max_level_num: 6,
  zoom_min_level_num: 0,
  mini_coeff: 1,
  objects_lt_x: -3000,
  objects_lt_y: 3000,
  objects_rb_x: 3000,
  objects_rb_y: -3000,
  currW: function () { return this.w * this.z; },
  currH: function () { return this.h * this.z; },
  zoomMax: function () { return this.zoom_start * (this.zoom_step ** this.zoom_max_level_num); },
  zoomMin: function () { return this.zoom_start / (this.zoom_step ** this.zoom_min_level_num); },
  log: function (message) {
    console.log(`----- map state (${message}) -----`);
    console.log('w: ' + this.w + '   h: ' + this.h + '   vw: ' + this.vw + '   vh: ' + this.vh + '   z: ' + this.z + '   mini_coeff: ' + this.mini_coeff + '   x: ' + this.x + '   y: ' + this.y);
  }
}

// инициализировать карту
function initMap() {
  map.vw = parseFloat(window.getComputedStyle(mapViewbox).width);
  map.vh = parseFloat(window.getComputedStyle(mapViewbox).height);
  map.x = 0;
  map.y = 0;
  map.z = map.zoom_start;

  let image_width = parseFloat(mapContent.getAttribute('data-map-width'));
  let image_height = parseFloat(mapContent.getAttribute('data-map-height'));
  setMapWH(image_width, image_height);

  setMapSize();
  setMapPosition();
  mapScaleButtonScale.innerText = String(Math.round(map.z * 100) + '%');
}


// инициализировать миникарту
function initMinimap() {
  let mapW = map.currW();
  let mapH = map.currH();
  map.miniw = parseFloat(window.getComputedStyle(minimapWrapper).width);

  setMinimapCoefficient();

  minimap.style.setProperty('width', (mapW * map.mini_coeff) + 'px');
  minimap.style.setProperty('height', (mapH * map.mini_coeff) + 'px');

  setMinimapSize();
  setMinimapPosition();
}



initMap();
initMinimap();


// подогнать размеры карты под размеры и пропорцию viewbox
function setMapWH(width = map.w, height = map.h) {
  let proportion = width / height;
  if (map.vw / map.vh >= proportion) {
    map.w = map.vw;
    map.h = map.w / proportion;
  } else {
    map.h = map.vh;
    map.w = map.h * proportion;
  }
}




// масштабировать карту
function zoomMap(direction, xFromCenter = map.x, yFromCenter = map.y) {
  let zoomCoefficient = 1;

  if (direction === 'zoom-to-center') { 
    zoomCoefficient = map.zoom_start / map.z;

  } else {
    if (direction === 'zoom-in') {
      zoomCoefficient = map.zoom_step;
      if (map.z * zoomCoefficient > map.zoomMax()) {
        zoomCoefficient = map.zoomMax() / map.z;
      }

    } else if (direction === 'zoom-out') {
      zoomCoefficient = 1 / map.zoom_step;
      if (map.z * zoomCoefficient < map.zoomMin()) {
        zoomCoefficient = map.zoomMin() / map.z;
      }
    }
  }

  map.z *= zoomCoefficient;
  setMapSize();
  setMinimapCoefficient();

  deltaX = xFromCenter - (xFromCenter * zoomCoefficient);
  deltaY = yFromCenter - (yFromCenter * zoomCoefficient);
  moveMap(deltaX, deltaY);

  setMinimapSize();
  mapScaleButtonScale.innerText = Math.round(map.z * 100) + '%';
}


function setMinimapCoefficient() {
  map.mini_coeff = map.miniw / map.currW();
}

function setMapSize() {
  mapContent.style.setProperty('width', `${map.currW() + 'px'}`);
  mapContent.style.setProperty('height', `${map.currH() + 'px'}`);
}

function setMinimapSize() {
  minimapViewbox.style.setProperty('width', (map.vw * map.mini_coeff) + 'px');
  minimapViewbox.style.setProperty('height', (map.vh * map.mini_coeff) + 'px');
}

function setMapPosition() {
  mapContent.style.setProperty('left', (map.vw / 2 - map.x) + 'px');
  mapContent.style.setProperty('top', (map.vh / 2 - map.y) + 'px');
}

function setMinimapPosition() {
  minimapViewbox.style.setProperty('left', ((map.currW() / 2 + map.x) * map.mini_coeff) + 'px');
  minimapViewbox.style.setProperty('top', ((map.currH() / 2 + map.y) * map.mini_coeff) + 'px');
}


// перетащить карту
function moveMap(deltaX = 0, deltaY = 0) {
  map.x -= deltaX;
  map.y -= deltaY;
  let mapW = map.currW();
  let mapH = map.currH();

  // проверка, не выходит ли сдвиг карты за границы viewbox
  if (map.x < (map.vw - mapW) / 2) { map.x = (map.vw - mapW) / 2; }
  if (map.x > (mapW - map.vw) / 2) { map.x = (mapW - map.vw) / 2; }
  if (map.y < (map.vh - mapH) / 2) { map.y = (map.vh - mapH) / 2; }
  if (map.y > (mapH - map.vh) / 2) { map.y = (mapH - map.vh) / 2; }

  setMapPosition();
  setMinimapPosition();
}







window.addEventListener('resize', () => {
  map.vw = parseFloat(window.getComputedStyle(mapViewbox).width);
  map.vh = parseFloat(window.getComputedStyle(mapViewbox).height);
  setMapWH();
  setMinimapCoefficient();
  setMapSize();
  setMinimapSize();
  moveMap();
})




// drag-and-move the map

dragElemInit(mapContent);

mapContent.addEventListener('mousedown', (e) => {
  dragElemOnMouseDown(mapContent, e);
})

mapContent.addEventListener('mouseleave', (e) => {
  dragElemOnMouseLeave(mapContent, e);
})

mapContent.addEventListener('mouseup', (e) => {
  dragElemOnMouseUp(mapContent, e);
})

mapContent.addEventListener('mousemove', (e) => {
  dragElemOnMouseMove(e, 'map');
})


mapContent.addEventListener('wheel', (e) => {
  e.preventDefault();

  let xFromCenter = map.x + (e.clientX - mapViewbox.getBoundingClientRect().left) - map.vw / 2;
  let yFromCenter = map.y + (e.clientY - mapViewbox.getBoundingClientRect().top) - map.vh / 2;

  if (e.deltaY < 0) {
    zoomMap('zoom-in', xFromCenter, yFromCenter);
  } else {
    zoomMap('zoom-out', xFromCenter, yFromCenter);
  }
})



// ----- minimap -----



dragElemInit(minimapViewbox);

minimapViewbox.addEventListener('mousedown', (e) => {
  dragElemOnMouseDown(minimapViewbox, e);
})

// minimapViewbox.addEventListener('mouseleave', (e) => {
//   dragElemOnMouseLeave(minimapViewbox, e);
// })   

minimapViewbox.addEventListener('mouseup', (e) => {
  dragElemOnMouseUp(minimapViewbox, e);
})

minimapViewbox.addEventListener('mousemove', (e) => {
  dragElemOnMouseMove(e, 'minimap');
})








// DRAG AND DROP functions




function dragElemInit(elem) {
  elem.style.setProperty('--drag-start-x', '0');
  elem.style.setProperty('--drag-start-y', '0');
  elem.style.setProperty('--drag-is-dragging', 'false');
}


function dragElemOnMouseDown(elem, e) {
  let startX = e.clientX - elem.getBoundingClientRect().left;
  let startY = e.clientY - elem.getBoundingClientRect().top;

  elem.style.setProperty('--drag-is-dragging', 'true');
  elem.style.setProperty('--drag-start-x', startX);
  elem.style.setProperty('--drag-start-y', startY);
}

function dragElemOnMouseLeave(elem, e) {
  elem.style.setProperty('--drag-is-dragging', 'false');
}

function dragElemOnMouseUp(elem, e) {
  elem.style.setProperty('--drag-is-dragging', 'false');
}

function dragElemOnMouseMove(e, mapType) {
  let elem;
  if (mapType === 'map') {
    elem = mapContent;
  } else if (mapType === 'minimap') {
    elem = minimapViewbox;
  }

  if (elem.style.getPropertyValue('--drag-is-dragging') === 'true') {
    e.preventDefault();
    startX = parseFloat(elem.style.getPropertyValue('--drag-start-x'));
    startY = parseFloat(elem.style.getPropertyValue('--drag-start-y'));
    newX = e.clientX - elem.getBoundingClientRect().left;
    newY = e.clientY - elem.getBoundingClientRect().top;

    let deltaX = (newX - startX);
    let deltaY = (newY - startY);

    let deltaXmap;
    let deltaYmap;

    if (mapType === 'map') {
      deltaXmap = deltaX;
      deltaYmap = deltaY;

    } else if (mapType === 'minimap') {
      deltaXmap = 0 - deltaX / map.mini_coeff;
      deltaYmap = 0 - deltaY / map.mini_coeff;
    }

    moveMap(deltaXmap, deltaYmap);
  }
}





function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomHouses(num) {
  let objects = [];
  for (let i = 0; i < num; i++) {
    objects.push({
      object: 'house',
      name: i,
      interior: randomNum(0, 10),
      price: randomNum(10000, 999999),
      status: randomNum(0, 1),
      coords: {
        x: randomNum(-3000, 3000),
        y: randomNum(-3000, 3000)
      }
    });
  }
  return objects;
}

let objectsHouses = randomHouses(300);
let objectsAreas = [];
let objectsChests = [];
let objectsNavigators = [];
let objectsNpc = [];
let objectsFuels = [];
let objectsTraders = [];

window.addEventListener('load', async function () {
  let responceResults = {
    areas: [],
    chests: [],
    navigators: [],
    npc: [],
    fuels: [],
    traders: []
  };

  for (let type of Object.keys(responceResults)) {
    let typeFirstLetter = type.charAt(0).toUpperCase() + type.slice(1);
    try {
      const response = await fetch(`../../mapObjects${typeFirstLetter}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      responceResults[type] = await response.json();
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  }

  objectsAreas = responceResults.areas;
  objectsChests = responceResults.chests;
  objectsNavigators = responceResults.navigators;
  objectsNpc = responceResults.npc;
  objectsFuels = responceResults.fuels;
  objectsTraders = responceResults.traders;

  renderMap();

  allTypes = ['houses', 'areas', 'chests', 'navigators', 'npc', 'fuels', 'traders'];

  let mapToggleLayersButtonAll = document.querySelector('.c-section.map #id-radio-map-layers-all');
  mapToggleLayersButtonAll.addEventListener('change', () => {
    for (let type of allTypes) {
      let mapLayerObjects = document.querySelector(`.map-layer.objects.layer-${type}`);
      mapLayerObjects.style.display = 'block';
    }    
  })

  for (let type of allTypes) {
    let mapToggleLayersButton = document.querySelector(`.c-section.map #id-radio-map-layers-${type}`);
    mapToggleLayersButton.addEventListener('change', () => {
      for (let thisType of allTypes) {
        let mapLayerObjects = document.querySelector(`.map-layer.objects.layer-${thisType}`);
        mapLayerObjects.style.display = (thisType === type) ? 'block' : 'none';
      }    
    })
  }
});

function renderMap() {
  drawMapObjectsAreasAndTowers();
  drawMapObjects('houses', objectsHouses);
  drawMapObjects('chests', objectsChests);
  drawMapObjects('navigators', objectsNavigators);
  drawMapObjects('npc', objectsNpc);
  drawMapObjects('fuels', objectsFuels);
  drawMapObjects('traders', objectsTraders);
}

function drawMapObjects(type, objects) {
  let objectLayer = document.createElement('div');
  objectLayer.classList.add('map-layer', 'objects', 'layer-' + type);

  objects.forEach(object => {
    drawObject(objectLayer, object);
  })
  mapContent.appendChild(objectLayer);
}



function drawMapObjectsAreasAndTowers() {
  let objectLayer = document.createElement('div');
  objectLayer.classList.add('map-layer', 'objects', 'layer-areas');

  let groupColors = {
    'Смурфики': '#00aeff',
    'Одиночка': '#ffffff'
  }

  objectsAreas.forEach(objectsArea => {
    let area = document.createElement('div');
    area.classList.add('object-area');

    area.style.left = countMapObjectLeft(objectsArea.areaSquare.x);
    area.style.top = countMapObjectTop(objectsArea.areaSquare.y);
    area.style.width = countMapObjectAreaWidth(objectsArea.areaSquare.w);
    area.style.height = countMapObjectAreaHeight(objectsArea.areaSquare.h);
    area.style.border = `2px solid ${groupColors[objectsArea.group]}`;
    area.style.backgroundColor = `${groupColors[objectsArea.group] + '55'}`;
    area.style.zIndex = 1000;
    area.setAttribute('data-name', objectsArea.name);

    objectLayer.appendChild(area);

    drawObject(objectLayer, objectsArea.tower);
  })

  mapContent.appendChild(objectLayer);
}



function drawObject(objectLayer, objectData) {
  let iconNamePath = '#id-svg-map--map-icons--';
  let svgViewboxes = {
    'house': '0 0 42 46',
    'tower': '0 0 12 16.5',
    'chest': '0 0 19 15',
    'navigator': '0 0 21 21',
    'npc': '0 0 64 64',
    'fuel': '0 0 51 48',
    'trader': '0 0 64 64'
  }

  let object = document.createElement('div');
  object.classList.add('object');

  let objectButton = document.createElement('div');
  objectButton.classList.add('object-button');

  // let objectButtonShadow = document.createElement('div');
  // objectButtonShadow.classList.add('object-button-shadow');

  let iconImage = document.createElement('div');
  iconImage.classList.add('icon-image', 'svg-wrapper');

  const SVG_namespace = 'http://www.w3.org/2000/svg';
  let iconSvg = document.createElementNS(SVG_namespace, 'svg');
  iconSvg.classList.add('svg');
  iconSvg.setAttribute('viewBox', svgViewboxes[objectData.object]);

  let SvgUse = document.createElementNS(SVG_namespace, 'use');
  SvgUse.setAttribute('href', iconNamePath + objectData.object);

  iconSvg.appendChild(SvgUse);
  iconImage.appendChild(iconSvg);
  // objectButton.appendChild(objectButtonShadow);
  objectButton.appendChild(iconImage);
  object.appendChild(objectButton);

  object.style.left = countMapObjectLeft(objectData.coords.x);
  object.style.top = countMapObjectTop(objectData.coords.y);
  object.style.zIndex = 2000;
  object.setAttribute('data-name', objectData.name);


  object.addEventListener('click', (e) => {
    e.stopPropagation();
    showMapDisplay(objectData);
  })

  objectLayer.appendChild(object);
}








function showMapDisplay(object) {
  hideMapDisplay();
  let display = map_element.querySelector('.display-block');
  display.classList.add('display-block-' + object.object);
  let displayTitle = display.querySelector('.title');
  let displayParameters = display.querySelector('.parameters');

  let addParams = function() {}

  switch (object.object) {
    case 'house':
      addParams = function() {
        displayTitle.innerText = 'Дом: #' + object.name;
        addParam('Интерьер: ', object.interior);
        addParam('Цена: ', '$' + object.price);
        let status = (object.status === 1) ? 'Доступно' : "Закрыто";
        addParam('Статус: ', status);
        addParam('Координаты: ', object.coords.x.toFixed(1) + ', ' + object.coords.y.toFixed(1));
      }
      break;

    case 'tower':
      addParams = function() {
        displayTitle.innerText = 'Вышка: ' + object.name;
        addParam('Территория: ', object.name);
        addParam('Группировка: ', object.group);
        addParam('Заполненность: ', object.fullness[0] + '/' + object.fullness[1]);
        addParam('Резерв: ', object.rezerv[0] + '/' + object.rezerv[1]);
        addParam('Тип: ', object.type);
        addParam('Координаты: ', object.coords.x.toFixed(1) + ', ' + object.coords.y.toFixed(1));
      }
      break;
      
    case 'chest':
      addParams = function() {
        displayTitle.innerText = 'Сундук: #' + object.name;
        addParam('Координаты: ', object.coords.x.toFixed(1) + ', ' + object.coords.y.toFixed(1));
      }
      break;

    case 'navigator':
      addParams = function() {
        displayTitle.innerText = 'Навигатор: ' + object.name;
        addParam('Имя: ', object.name);
        addParam('Координаты: ', object.coords.x.toFixed(1) + ', ' + object.coords.y.toFixed(1));
      }
      break;

    case 'npc':
      addParams = function() {
        displayTitle.innerText = 'NPC: ' + object.name;
        addParam('Скин ID: ', object.skinId);
        addParam('Координаты: ', object.coords.x.toFixed(1) + ', ' + object.coords.y.toFixed(1));
      }
      break;

    case 'fuel':
      addParams = function() {
        displayTitle.innerText = 'Заправка: #' + object.name;
        addParam('Координаты: ', object.coords.x.toFixed(1) + ', ' + object.coords.y.toFixed(1));
      }
      break;

    case 'trader':
      addParams = function() {
        displayTitle.innerText = 'Торговец: ' + object.name;
        addParam('Имя: ', object.name);
        addParam('Магазин: ', object.shop);
        addParam('Скин ID: ', object.skinId);
        addParam('Координаты: ', object.coords.x.toFixed(1) + ', ' + object.coords.y.toFixed(1));
      }
      break;
  }

  function addParam(param, value) {
    let paramWrapper = document.createElement('div');
    paramWrapper.classList.add('parameter');

    let textParam = document.createElement('span');
    textParam.classList.add('text', 'param');
    textParam.innerText = param;
    
    let textValue = document.createElement('span');
    textValue.classList.add('text', 'value');
    textValue.innerText = value;

    paramWrapper.appendChild(textParam);
    paramWrapper.appendChild(textValue);
    displayParameters.appendChild(paramWrapper);
  }

  addParams();
  display.style.display = 'block';
}

function hideMapDisplay() {
  let display = map_element.querySelector('.display-block');
  display.classList.remove(...display.classList);
  display.classList.add('display-block');
  let displayTitle = display.querySelector('.title');
  displayTitle.innerText = '';
  let displayParameters = display.querySelector('.parameters');
  displayParameters.innerHTML = '';
  display.style.display = 'none';
}

function countMapObjectLeft(coordX) {
  let mapSizeX = Math.abs(map.objects_rb_x - map.objects_lt_x);
  return ((coordX - map.objects_lt_x) / mapSizeX * 100) + '%';
}

function countMapObjectTop(coordY) {
  let mapSizeY = Math.abs(map.objects_rb_y - map.objects_lt_y);
  return ((-(coordY - map.objects_lt_y)) / mapSizeY * 100) + '%';
}

function countMapObjectAreaWidth(width) {
  let mapSizeX = Math.abs(map.objects_rb_x - map.objects_lt_x);
  return (width / mapSizeX * 100) + '%';
}

function countMapObjectAreaHeight(height) {
  let mapSizeY = Math.abs(map.objects_rb_y - map.objects_lt_y);
  return (height / mapSizeY * 100) + '%';
}




map_element.addEventListener('click', (e) => {
  hideMapDisplay();
});











// // КЛАСТЕРИЗАЦИЯ
// // КЛАСТЕРИЗАЦИЯ
// // КЛАСТЕРИЗАЦИЯ

// let mapSections = [];

// function divideMapIntoSections() {
//   let mapZooms = [];
//   for (let i = map.zoom_min_level_num; i > 0; i--) {
//     mapZooms.push(map.zoom_start / (map.zoom_step ** i));
//   }
//   for (let i = 0; i <= map.zoom_max_level_num; i++) {
//     mapZooms.push(map.zoom_start * (map.zoom_step ** i));
//   }

//   let sectionSizeW = map.vw / 2;
//   let sectionSizeH = map.vh / 2;

//   for (let zoom of mapZooms) {
//     let mapSizeW = map.w * zoom;
//     let mapSizeH = map.h * zoom;
//     let rowNum = Math.ceil(mapSizeW / sectionSizeH);
//     let colNum = Math.ceil(mapSizeH / sectionSizeW);
//     let zoomMapSections = {
//       zoom: zoom,
//       mapSize: {w: mapSizeW, h: mapSizeH},
//       sectionSize: {w: sectionSizeW, h: sectionSizeH},
//       sectionNum: {rows: rowNum, cols: colNum},
//       sections: []
//     };

//     for (let i = 0; i < rowNum; i++) {
//       for (let j = 0; j < colNum; j++) {
//         let section = {
//           sectionId: ('r' + (i + 1) + 'c' + (j + 1)),
//           x1: (sectionSizeW * i) / mapSizeW * 100,
//           y1: (sectionSizeH * j) / mapSizeH * 100,
//           x2: (sectionSizeW * (i + 1)) / mapSizeW * 100,
//           y2: (sectionSizeH * (j + 1)) / mapSizeH * 100,
//           objects: []
//         }
//         zoomMapSections.sections.push(section);
//       }
//     }
//     mapSections.push(zoomMapSections);
//   }
// }

// divideMapIntoSections();


// function distributeObjectsBySections(objects) {
//   let mapSizeX = Math.abs(map.objects_rb_x - map.objects_lt_x);
//   let mapSizeY = Math.abs(map.objects_rb_y - map.objects_lt_y);

//   for (let i = 0; i < mapSections.length; i++) {
//     for (let object of objects) {
//       let x = (object.coords.x - map.objects_lt_x) / mapSizeX * mapSections[i].mapSize.w;
//       let y = -(object.coords.y - map.objects_lt_y) / mapSizeY * mapSections[i].mapSize.h;
//       let rowNum = Math.ceil(y / mapSections[i].sectionSize.h);
//       let colNum = Math.ceil(x / mapSections[i].sectionSize.w);
//       let id = mapSections[i].sections.indexOf(mapSections[i].sections.find(section => section.sectionId === 'r' + rowNum + 'c' + colNum));
//       mapSections[i].sections[id].objects.push(object);
//     }    
//   }
// }

// distributeObjectsBySections(objectsHouses);
// distributeObjectsBySections(objectsChests);
// distributeObjectsBySections(objectsNavigators);
// distributeObjectsBySections(objectsNpc);
// distributeObjectsBySections(objectsFuels);
// distributeObjectsBySections(objectsTraders);


// function createObjectsByMapSections() {
//   for (let i = 0; i < mapSections.length; i++) {
//     let objectZoomLayer = document.createElement('div');
//     objectZoomLayer.classList.add('map-layer', 'objects');
//     objectZoomLayer.setAttribute('data-zoom', mapSections[i].zoom);
//     objectZoomLayer.style.display = (mapSections[i].zoom === map.z) ? 'block' : 'none';

//     for (section of mapSections[i].sections) {
//       let sectionElem = document.createElement('div');
//       sectionElem.classList.add('map-section', section.sectionId);
      
//       for (object of section.objects) {
//         let objectElem = createObject(object);
//         sectionElem.appendChild(objectElem);
//       }

//       objectZoomLayer.appendChild(sectionElem);
//     }

//     mapContent.appendChild(objectZoomLayer);
//   }
// }

// createObjectsByMapSections();


// function createObject(objectData) {
//   let iconNamePath = '#id-svg-map--map-icons--';
//   let svgViewboxes = {
//     'house': '0 0 42 46',
//     'tower': '0 0 12 16.5',
//     'chest': '0 0 19 15',
//     'navigator': '0 0 21 21',
//     'npc': '0 0 64 64',
//     'fuel': '0 0 51 48',
//     'trader': '0 0 64 64'
//   }

//   let objectElem = document.createElement('div');
//   objectElem.classList.add('object');

//   let objectButton = document.createElement('div');
//   objectButton.classList.add('object-button');

//   // let objectButtonShadow = document.createElement('div');
//   // objectButtonShadow.classList.add('object-button-shadow');

//   let iconImage = document.createElement('div');
//   iconImage.classList.add('icon-image', 'svg-wrapper');

//   const SVG_namespace = 'http://www.w3.org/2000/svg';
//   let iconSvg = document.createElementNS(SVG_namespace, 'svg');
//   iconSvg.classList.add('svg');
//   iconSvg.setAttribute('viewBox', svgViewboxes[objectData.object]);

//   let SvgUse = document.createElementNS(SVG_namespace, 'use');
//   SvgUse.setAttribute('href', iconNamePath + objectData.object);

//   iconSvg.appendChild(SvgUse);
//   iconImage.appendChild(iconSvg);
//   // objectButton.appendChild(objectButtonShadow);
//   objectButton.appendChild(iconImage);
//   objectElem.appendChild(objectButton);

//   objectElem.style.left = countMapObjectLeft(objectData.coords.x);
//   objectElem.style.top = countMapObjectTop(objectData.coords.y);
//   objectElem.style.zIndex = 2000;
//   objectElem.setAttribute('data-name', objectData.name);


//   objectElem.addEventListener('click', (e) => {
//     e.stopPropagation();
//     showMapDisplay(objectData);
//   })

//   return objectElem;
// }




// function checkSectionsForShow() {
//   let map_layers = map_element.querySelectorAll(`.map-layer.objects`);
//   let mapLayer;
//   for (let map_layer of map_layers) {
//     if (parseFloat(map_layer.getAttribute('data-zoom')) === map.z) {
//       mapLayer = map_layer;
//     }
//   }
//   let sections = mapLayer.querySelectorAll('.map-section');

//   for (let section of sections) {
//     section.style.display = 'none';
//   }
//   let z;
//   for (let i = 0; i < mapSections.length; i++) {
//     if (mapSections[i].zoom === map.z) {
//       z = i;
//     }
//   }
//   let x = map.x + map.currW()/2;
//   let y = map.y + map.currH()/2;
//   let centerRowNum = Math.ceil(y / mapSections[z].sectionSize.h);
//   let centerColNum = Math.ceil(x / mapSections[z].sectionSize.w);
//   console.log('centerRowNum ' + centerRowNum + ' centerColNum ' + centerColNum);

//   // let rowMin = (centerRowNum <= 1) ? 1 : centerRowNum - 1;
//   // let rowMax = (centerRowNum >= mapSections[z].sectionNum.rows) ? mapSections[z].sectionNum.rows : centerRowNum + 1;
//   // let colMin = (centerColNum <= 1) ? 1 : centerColNum - 1;
//   // let colMax = (centerColNum >= mapSections[z].sectionNum.cols) ? mapSections[z].sectionNum.cols : centerColNum + 1;

//   let rowMin = (centerRowNum <= 1) ? 1 : centerRowNum;
//   let rowMax = (centerRowNum >= mapSections[z].sectionNum.rows) ? mapSections[z].sectionNum.rows : centerRowNum;
//   let colMin = (centerColNum <= 1) ? 1 : centerColNum;
//   let colMax = (centerColNum >= mapSections[z].sectionNum.cols) ? mapSections[z].sectionNum.cols : centerColNum;

//   for (let i = rowMin; i <= rowMax; i++) {
//     for (let j = colMin; j <= colMax; j++) {
//       let section = mapLayer.querySelector(`.map-section.${'r' + i + 'c' + j}`);
//       section.style.display = 'block';
//     }
//   }
// }


// checkSectionsForShow();