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

  // Gestione Mostra/Nascondi Legenda con jQuery
  $("#toggleLegend").click(function () {
    let legendContainer = $("#legendContainer");
    let toggleButton = $("#toggleLegend");

    // Alterna la classe 'show' per la legenda
    legendContainer.toggleClass("show");

    // Cambia la freccia e il testo del tooltip
    if (legendContainer.hasClass("show")) {
      toggleButton
        .find("img")
        .attr("src", "/assets/images/down-long-solid.svg"); // Cambia la freccia quando la legenda è visibile
      toggleButton.attr("data-bs-original-title", "Nascondi"); // Modifica il tooltip
    } else {
      toggleButton.find("img").attr("src", "/assets/images/up-long-solid.svg"); // Ritorna la freccia iniziale
      toggleButton.attr("data-bs-original-title", "Mostra"); // Modifica il tooltip
    }

    // Rende visibile il nuovo tooltip
    toggleButton.tooltip("dispose").tooltip();
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
