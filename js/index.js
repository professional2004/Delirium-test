
// section about-project -- image and card

let cardsCarouselLayout = document.querySelector('.c-section.about-project .layout');
let cardsCarouselLayoutDisplay = cardsCarouselLayout.querySelector('.display');
let cardsCarouselLayoutDisplayDescription = cardsCarouselLayoutDisplay.querySelector('.description');

let imagePath = '../materials/images/index/';

let radioChangeContent = [
  {
    name: 'infrastructure',
    image_src: `${imagePath + 'about-project-cards--anomalies.png'}`,
    description_title: 'Инфраструктура',
    description_text: 'Десятки торговцев, барменов и контрабандистов'
  },
  {
    name: 'kvests',
    image_src: `${imagePath + 'about-project-cards--anomalies.png'}`,
    description_title: 'Квесты',
    description_text: 'В свободное от выживания время'
  },
  {
    name: 'anomalies',
    image_src: `${imagePath + 'about-project-cards--anomalies.png'}`,
    description_title: 'Аномалии',
    description_text: 'Просто смотри под ноги'
  },
  {
    name: 'artifacts',
    image_src: `${imagePath + 'about-project-cards--anomalies.png'}`,
    description_title: 'Артефакты',
    description_text: 'Много артефактов. Очень много.'
  },
  {
    name: 'things',
    image_src: `${imagePath + 'about-project-cards--anomalies.png'}`,
    description_title: 'Разнообразие вещей',
    description_text: 'От ножа до джет-пака, более сотни видов вещей'
  },
  {
    name: 'var',
    image_src: `${imagePath + 'about-project-cards--anomalies.png'}`,
    description_title: 'Война группировок',
    description_text: 'Выживает сильнейший'
  }
];

cardsCarouselLayout.querySelectorAll('input[type=radio]').forEach((inputRadio) => {
  inputRadio.addEventListener('change', () => {
    let newContent = radioChangeContent.find(content => content.name === inputRadio.value);
    cardsCarouselLayoutDisplay.style.backgroundImage = `url("${newContent.image_src}")`;
    cardsCarouselLayoutDisplayDescription.querySelector('.title').innerText = newContent.description_title;
    cardsCarouselLayoutDisplayDescription.querySelector('.text').innerText = newContent.description_text;
  })
})


// section faq -- questions and answers

let sectionFaq = document.querySelector('.c-section.faq');
let questionCards = sectionFaq.querySelectorAll('.question-cards .question-card');
let maxQuestionHeight = 0;
let closedHeight = 0;
let paddingHeight = 0;

function countQuestionCardsHeight() {

  questionCards.forEach((card) => {
    let questionHeight = card.querySelector('.title').scrollHeight;
    paddingHeight = parseFloat(window.getComputedStyle(card).getPropertyValue('--padding-vertical'));
    if (maxQuestionHeight < questionHeight) {
      maxQuestionHeight = questionHeight;
      closedHeight = maxQuestionHeight + paddingHeight * 2;
    }
  })

  questionCards.forEach((card) => {
    let questionHeight = card.querySelector('.title').scrollHeight;
    // для answerHeight + 5px запаса
    let answerHeight = card.querySelector('.text').scrollHeight + 5;
    let gapHeight = parseFloat(window.getComputedStyle(card).gap);

    console.log('----- card -----');
    console.log('questionHeight ' + questionHeight + ', paddingHeight ' + paddingHeight + ', answerHeight ' + answerHeight + ', gapHeight ' + gapHeight);

    let closePadding = (maxQuestionHeight - questionHeight) / 2 + paddingHeight;
    card.style.setProperty('--padding-vertical-closed', `${closePadding + 'px'}`);

    let openHeight = questionHeight + answerHeight + gapHeight + paddingHeight * 2;
    let openPadding = paddingHeight;

    if (openHeight < closedHeight) {
      openHeight = closedHeight;
      openPadding = (openHeight - questionHeight - answerHeight - gapHeight) / 2;
    }
    card.style.setProperty('--js--open-height', `${openHeight + 'px'}`);
    card.style.setProperty('--padding-vertical-open', `${openPadding + 'px'}`);

    
  })

  sectionFaq.style.setProperty('--js--section-faq--question-card-height', `${closedHeight + 'px'}`);
}

countQuestionCardsHeight();

window.addEventListener('resize', () => {
  countQuestionCardsHeight();
}) 



