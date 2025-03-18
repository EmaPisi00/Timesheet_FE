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

export function showToast(message, toastClass) {
  // Crea il Toast
  const toastContainer = document.createElement("div");
  toastContainer.classList.add(
    "toast-container",
    "position-fixed",
    "top-0",
    "end-0",
    "p-3"
  );

  const toast = document.createElement("div");
  toast.classList.add("toast", toastClass, "fade");
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");

  const toastBody = document.createElement("div");
  toastBody.classList.add("toast-body");
  toastBody.innerText = message;

  toast.appendChild(toastBody);
  toastContainer.appendChild(toast);
  document.body.appendChild(toastContainer);

  // Mostra il Toast con una breve animazione
  const bootstrapToast = new bootstrap.Toast(toast);
  bootstrapToast.show();

  // Rimuove il Toast dopo 5 secondi
  setTimeout(() => {
    toast.remove();
  }, 5000);
}
