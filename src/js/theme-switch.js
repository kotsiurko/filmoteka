const checkbox = document.querySelector('#theme-switch-toggle');
const theme = {
  LIGHT: 'light-theme',
  DARK: 'dark-theme',
};

document.body.classList.add(theme.LIGHT);

checkbox.addEventListener('change', onCheckboxChange);

function onCheckboxChange() {
  document.body.classList.toggle(theme.DARK);
  document.body.classList.toggle(theme.LIGHT);

  setThemeInfoToLocalStorage();
}

function setThemeInfoToLocalStorage() {
  if (document.body.classList.contains(theme.LIGHT)) {
    checkbox.setAttribute('checked', false);
    localStorage.setItem('active-theme', theme.LIGHT);
  } else if (document.body.classList.contains(theme.DARK)) {
    checkbox.setAttribute('checked', true);
    localStorage.setItem('active-theme', theme.DARK);
  }
}

getThemeInfoFromLocalStorage();

function getThemeInfoFromLocalStorage() {
  if (localStorage.getItem('active-theme') === theme.DARK) {
    onCheckboxChange();
  }
}
