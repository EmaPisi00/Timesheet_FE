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

export function isVisible(value) {
  return $(value).is(":visible");
}

export async function showToast(message, toastClass) {
  // Controlla se esiste già un contenitore per i toast, altrimenti lo crea
  let $toastContainer = $("#toastContainer");
  if ($toastContainer.length === 0) {
    $toastContainer = $("<div>", {
      id: "toastContainer",
      class: "toast-container position-fixed top-0 end-0 p-3",
    }).appendTo("body");
  }

  // Crea il Toast
  let $toast = $("<div>", {
    class: `toast ${toastClass} fade show`,
    role: "alert",
    "aria-live": "assertive",
    "aria-atomic": "true",
    css: {
      backgroundColor: "#28a745", // Verde Bootstrap
      border: "none", // Rimuove bordo
      color: "black", // Testo bianco
      fontWeight: "bold",
      marginBottom: "5px", // Spazio tra i toast
    },
  });

  // Corpo del Toast
  let $toastBody = $("<div>", {
    class: "toast-body d-flex justify-content-between align-items-center",
  });

  // Testo del Toast
  let $messageSpan = $("<span>").text(message);

  // Pulsante "OK"
  let $closeButton = $("<button>", {
    class: "btn",
    html: '<img src="../assets/images/x.svg" alt="Close" style="width: 30px; height: 30px; color: white">', // Usa un'immagine personalizzata
    css: {
      color: "white",
      background: "none",
      border: "none",
      outline: "none", // Rimuove il bordo quando cliccato
      boxShadow: "none", // Evita bordi visibili su alcuni browser
    },
    click: function () {
      $toast.toast("hide");
    },
  });

  // Assembla gli elementi
  $toastBody.append($messageSpan, $closeButton);
  $toast.append($toastBody);

  // Aggiunge il toast in cima al contenitore
  $toastContainer.prepend($toast);

  // Mostra il Toast con un delay di 5 secondi
  let bootstrapToast = new bootstrap.Toast($toast[0], { delay: 5000 });
  bootstrapToast.show();

  // Rimuove il toast dopo 5 secondi
  setTimeout(() => $toast.remove(), 8000);
}

export function handleUnauthorizedAccess() {
  // Evita il loop controllando se sei già sulla pagina di login

  if (isVisible("#loginForm")) {
    return;
  }

  sessionStorage.removeItem("authToken");

  showToast("Sessione scaduta. Effettua nuovamente il login.", "bg-danger");

  setTimeout(() => {
    window.location.href = "/pages/main.html";
  }, 2000);
}

export function generateSecurePassword(length = 16) {
  const lowerCase = "abcdefghijklmnopqrstuvwxyz";
  const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const specialChars = "!@#$%^&*()-_=+[]{}|;:,.<>?";

  const allChars = lowerCase + upperCase + numbers + specialChars;
  let password = "";

  // Garantiamo che la password contenga almeno un carattere di ciascun tipo
  password += lowerCase[Math.floor(Math.random() * lowerCase.length)];
  password += upperCase[Math.floor(Math.random() * upperCase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += specialChars[Math.floor(Math.random() * specialChars.length)];

  // Aggiungiamo caratteri casuali per il resto della lunghezza della password
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Mescoliamo la password per renderla più casuale
  password = password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
  return password;
}
