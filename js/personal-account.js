let pageTabsSwitchRadios = document.getElementById('id--page-tabs-switch').querySelectorAll('.input-radio');
let settingsBlocksContainer = document.getElementById('id--settings-blocks-container');
let statisticsBlocksContainer = document.getElementById('id--statistics-blocks-container');

pageTabsSwitchRadios.forEach((pageTabsSwitchRadio) => {
  pageTabsSwitchRadio.addEventListener('change', () => {
    if (pageTabsSwitchRadio.value === 'radio-value--settings') {
      settingsBlocksContainer.style.display = 'block';
      statisticsBlocksContainer.style.display = 'none';
    } else if (pageTabsSwitchRadio.value === 'radio-value--statistics') {
      settingsBlocksContainer.style.display = 'none';
      statisticsBlocksContainer.style.display = 'grid';
    }
  })
})