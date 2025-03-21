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

export async function showToast(message, toastClass) {
  // Crea il contenitore del Toast
  const toastContainer = document.createElement("div");
  toastContainer.classList.add(
    "toast-container",
    "position-fixed",
    "top-0",
    "end-0",
    "p-3"
  );

  // Crea il Toast
  const toast = document.createElement("div");
  toast.classList.add("toast", toastClass, "fade", "show");
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");
  toast.style.backgroundColor = "#d4edda"; // Verde chiaro
  toast.style.border = "1px solid #c3e6cb";
  toast.style.color = "white";
  toast.style.font = "bold";

  // Corpo del Toast
  const toastBody = document.createElement("div");
  toastBody.classList.add("toast-body");
  toastBody.style.display = "flex";
  toastBody.style.justifyContent = "space-between";
  toastBody.style.alignItems = "center";

  // Testo del Toast
  const messageSpan = document.createElement("span");
  messageSpan.innerText = message;

  // Pulsante "OK"
  const closeButton = document.createElement("button");
  closeButton.innerText = "OK";
  closeButton.classList.add("btn", "btn-sm", "btn");
  closeButton.style.color = "white";
  closeButton.style.marginLeft = "10px"; // Spazio tra testo e pulsante

  closeButton.addEventListener("click", () => {
    bootstrapToast.hide(); // Chiude il toast manualmente
  });

  // Aggiunge gli elementi al toast
  toastBody.appendChild(messageSpan);
  toastBody.appendChild(closeButton);
  toast.appendChild(toastBody);
  toastContainer.appendChild(toast);
  document.body.appendChild(toastContainer);

  // Mostra il Toast con un delay specifico
  const bootstrapToast = new bootstrap.Toast(toast, { delay: 10000 }); // 5 secondi
  bootstrapToast.show();
}

export function handleUnauthorizedAccess() {
  // Evita il loop controllando se sei già sulla pagina di login
  if (window.location.pathname.includes("main.html")) return;

  sessionStorage.removeItem("authToken");

  showToast("Sessione scaduta. Effettua nuovamente il login.", "bg-danger");

  setTimeout(() => {
    window.location.href = "/pages/main.html";
  }, 2000);
}
