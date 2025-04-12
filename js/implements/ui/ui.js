import { hideItem, showItem, isEmpty } from "../../utils/utils.js";
import { getProfile } from "../auth/auth.js";

export async function setupUI() {
  $("#nav-icon").click(() => {
    $("#nav-icon").toggleClass("open");
    $("#sidebar").toggleClass("active");
  });

  $("#togglePasswordIcon").click(() => {
    let passwordField = $("#password");
    passwordField.attr(
      "type",
      passwordField.attr("type") === "password" ? "text" : "password"
    );

    $("#togglePasswordIcon").attr(
      "src",
      passwordField.attr("type") === "password"
        ? "/assets/images/eye-icon.png"
        : "/assets/images/eye-open.png"
    );
  });

  $("#toggleResetPasswordIcon").click(() => {
    let passwordField = $("#newPassword");
    passwordField.attr(
      "type",
      passwordField.attr("type") === "password" ? "text" : "password"
    );

    $("#toggleResetPasswordIcon").attr(
      "src",
      passwordField.attr("type") === "password"
        ? "/assets/images/eye-icon.png"
        : "/assets/images/eye-open.png"
    );
  });

  $("#toggleConfirmPasswordIcon").click(() => {
    let passwordField = $("#confirmPassword");
    passwordField.attr(
      "type",
      passwordField.attr("type") === "password" ? "text" : "password"
    );

    $("#toggleConfirmPasswordIcon").attr(
      "src",
      passwordField.attr("type") === "password"
        ? "/assets/images/eye-icon.png"
        : "/assets/images/eye-open.png"
    );
  });

  validatePasswords();

  // Ascolta per ogni cambiamento nelle password
  $("#newPassword, #confirmPassword").on("input", function () {
    validatePasswords();
  });

  // Blocca il submit se ci sono errori
  $("#passwordForm").on("submit", function (e) {
    const password = $("#newPassword").val();
    const confirmPassword = $("#confirmPassword").val();
    const errors = getPasswordErrors(password);

    if (errors.length > 0 || password !== confirmPassword) {
      e.preventDefault();
      validatePasswords();
    }
  });
}

export function showAuthenticatedUI() {
  initInitialsUsername();
  hideItem("#loginCardContainer");
  setTimeout(() => {
    $("#nav-icon").show().addClass("open");
    $("#sidebar").addClass("active").show();
    hideItem("#loadingSpinner");
    hideItem("#loadError");
    showItem("#user-menu");

    const userProfile = getProfile();
    $("#username").text(userProfile.name + " " + userProfile.surname);
  }, 2000);
}

export function initInitialsUsername() {
  var userProfile = getProfile();
  if (!isEmpty(userProfile)) {
    if (userProfile.role === "ADMIN") {
      showItem("#adminArea");
    }
    var fullName = userProfile.name.concat(" ").concat(userProfile.surname); // Nome utente
    $("#username").text(fullName);

    function getInitials(name) {
      var words = name.split(" ");
      return words.length > 1
        ? words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase()
        : words[0].charAt(0).toUpperCase();
    }

    // Imposta le iniziali come immagine predefinita
    var initials = getInitials(fullName);
    $("#profileImage").text(initials);
    $("#profileImageDropdown").text(initials);

    // Controlla se l'immagine esiste, altrimenti lascia le iniziali
    $("#user-img").on("load", function () {
      $(this).show();
      $("#profileImage").hide();
    });

    $("#user-info-img").on("load", function () {
      $(this).show();
      $("#profileImageDropdown").hide();
    });

    // Previene la chiusura automatica del dropdown quando si clicca all'interno
    $(".dropdown-menu").click(function (event) {
      event.stopPropagation();
    });
  }
}
// Funzione per ottenere gli errori della password
function getPasswordErrors(password) {
  const errors = [];

  if (password.length < 8) errors.push("Minimo 8 caratteri");
  if (!/[A-Z]/.test(password)) errors.push("Almeno una lettera maiuscola");
  if (!/[a-z]/.test(password)) errors.push("Almeno una lettera minuscola");
  if (!/\d/.test(password)) errors.push("Almeno un numero");
  if (!/[@$!%*?&]/.test(password))
    errors.push("Almeno un carattere speciale (@$!%*?&)");

  return errors;
}

// Funzione per validare le password
function validatePasswords() {
  const password = $("#newPassword").val();
  const confirmPassword = $("#confirmPassword").val();

  const errors = getPasswordErrors(password);

  // Mostra errori password
  const $passwordErrors = $("#passwordErrors");
  $passwordErrors.empty();

  if (errors.length > 0) {
    errors.forEach((err) => {
      $passwordErrors.append(`<li>${err}</li>`);
    });
  }

  // Verifica corrispondenza password
  if (password !== confirmPassword && confirmPassword.length > 0) {
    $("#matchError").text("Le password non coincidono.");
  } else {
    $("#matchError").text("");
  }

  // Controlla se abilitare il bottone di submit
  if (errors.length === 0 && password === confirmPassword) {
    $("#submitBtn").prop("disabled", false); // Abilita il bottone
  } else {
    $("#submitBtn").prop("disabled", true); // Disabilita il bottone
  }
}
