// openable

document.querySelectorAll('.js-openable').forEach((modalMenu) => {
  modalMenu.querySelector('.js-openable-button').addEventListener('click', () => {
    modalMenu.classList.add('open');
  })
  modalMenu.querySelector('.js-openable-backdrop').addEventListener('click', (e) => {
    if (!e.target.closest('.js-openable-content')) {
      modalMenu.classList.remove('open');
    }
  })
})




// modal-openable

document.querySelectorAll('.js-modal-openable').forEach((modalMenu) => {
  modalMenu.querySelector('.js-modal-openable-backdrop').addEventListener('click', (e) => {
    if (!e.target.closest('.js-modal-openable-content')) {
      modalMenu.classList.remove('open');
    }
  })
})








// select (openable)

let selectChangeEvent = new Event('selectChange');

document.querySelectorAll('.s-select').forEach((select) => {
  let options = select.querySelectorAll('.select-options-container .select-option');
  let text = select.querySelector('.select-button .text');

  options.forEach((option) => {
    option.addEventListener('click', () => {
      options.forEach((eachOption) => {
        eachOption.classList.remove('selected');
      })
      option.classList.add('selected');
      text.innerText = option.innerText;
      select.classList.remove('open');

      select.dispatchEvent(selectChangeEvent);
    })
  })
})

// input password 


document.querySelectorAll('.s-input.password').forEach((inputPassword) => {
  let eyeButton = inputPassword.querySelector('.toggle-show-button');
  let input = inputPassword.querySelector('.input');

  eyeButton.addEventListener('click', () => {
    if (input.getAttribute('type') === 'text') {
      input.setAttribute('type', 'password');
    } else if (input.getAttribute('type') === 'password') {
      input.setAttribute('type', 'text');
    }
  })
})


// tab

document.querySelectorAll('.s-horizontal-scrolled').forEach((tab) => {
  tab.style.setProperty('--start-x', '0');
  tab.style.setProperty('--scroll-left', '0');
  tab.style.setProperty('--is-down', 'false');
  
  tab.addEventListener('mousedown', (e) => {
    let startX = e.clientX - tab.getBoundingClientRect().left;
    let scrollLeft = tab.scrollLeft;

    tab.style.setProperty('--is-down', 'true');
    tab.style.setProperty('--start-x', startX);
    tab.style.setProperty('--scroll-left', scrollLeft);
  })

  tab.addEventListener('mouseleave', () => {
    tab.style.setProperty('--is-down', 'false');
  })   
  tab.addEventListener('mouseup', () => {
    tab.style.setProperty('--is-down', 'false');
  })   


  tab.addEventListener('mousemove', (e) => {
    if (tab.style.getPropertyValue('--is-down') === 'true') {
      e.preventDefault();
      let startX = Number(tab.style.getPropertyValue('--start-x'));
      let scrollLeft = Number(tab.style.getPropertyValue('--scroll-left'));
      let x = e.pageX - tab.offsetLeft;
      let delta = (x - startX);
      tab.scrollLeft = scrollLeft - delta;
    }
  })
})







let isBreakpointed = false;
let lastWindowWidth = window.innerWidth;

function checkIfBreakpointed() {
  if (lastWindowWidth >= 1600) {
    if (window.innerWidth < 1600) isBreakpointed = true;
    else isBreakpointed = false;
  }

  if (lastWindowWidth < 1600 && lastWindowWidth >= 770 ) {
    if (window.innerWidth >= 1600 || window.innerWidth < 770) isBreakpointed = true;
    else isBreakpointed = false;
  }

  if (lastWindowWidth < 770 ) {
    if (window.innerWidth >= 770) isBreakpointed = true;
    else isBreakpointed = false;
  }  

  lastWindowWidth = window.innerWidth;
  // console.log(isBreakpointed);
}

window.addEventListener('resize', () => {
  checkIfBreakpointed();
})

checkIfBreakpointed();









// selects -- setting content-fit width

let selects = document.querySelectorAll('.s-select');

function countSelectWidths() {
  selects.forEach((select) => {

    let hiddenOptionsContainer = select.querySelector('.hidden-options-list');
    hiddenOptionsContainer.style.display = 'block';

    let maxWidth = 0;
    hiddenOptionsContainer.querySelectorAll('.hidden-option').forEach((option) => {
      let optionWidth = Math.ceil(option.getBoundingClientRect().width);
      if (maxWidth < optionWidth) {
        maxWidth = optionWidth;
      }
      // console.log('optionWidth ' + optionWidth);
    })
    let selectButton = select.querySelector('.select-button');
    let paddings = parseInt(window.getComputedStyle(selectButton).paddingLeft) + parseInt(window.getComputedStyle(selectButton).paddingRight);
    let width = maxWidth + paddings + 4;

    select.style.setProperty('--js--select-width', `${width + 'px'}`);
    hiddenOptionsContainer.style.display = 'none';

    // console.log('maxWidth ' + maxWidth + ', paddings ' + paddings + ', width ' + width);
  })
}


window.addEventListener('resize', () => {
  if (isBreakpointed) {
    countSelectWidths();
  }
})

countSelectWidths();







// --------- modal windows -------------

let buttonLogin = document.getElementById('id-button-login');
let modalAuthorisation = document.getElementById('id-modal-authorisation');
let buttonRecover = document.getElementById('id-button-recover');
let modalRecovering = document.getElementById('id-modal-recovery');

// buttonLogin.addEventListener('click', () => {
//   modalAuthorisation.classList.add('open');
// })

// buttonRecover.addEventListener('click', () => {
//   modalAuthorisation.classList.remove('open');
//   modalRecovering.classList.add('open');
// })

let modalCloseButtons = document.querySelectorAll('.s-modal .button-close');

modalCloseButtons.forEach((modalCloseButton => {
  modalCloseButton.addEventListener('click', (e) => {
    e.target.closest('.s-modal').classList.remove('open');
  })
}))