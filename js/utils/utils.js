// Funzione che disabilita i link e i pulsanti
export function disableLinks() {
  // Disabilita tutti i pulsanti e i link
  document.querySelectorAll("a, button").forEach(function (element) {
    element.classList.add("disabled"); // Aggiunge la classe 'disabled'
  });
}

// Funzione che riabilita i link e i pulsanti
export function enableLinks() {
  // Abilita tutti i pulsanti e i link
  document.querySelectorAll("a, button").forEach(function (element) {
    element.classList.remove("disabled"); // Rimuove la classe 'disabled'
  });
}

// FUNZIONE PER NASCONDERE GLI ELEMENTI
export function hideItem(item) {
  $(item).hide();
}

// FUNZIONE PER MOSTRARE GLI ELEMENTI
export function showItem(item) {
  $(item).show();
}

export function isEmpty(value) {
  return value === undefined || value === null || value === "";
}