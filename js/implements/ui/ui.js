import { hideItem, showItem } from "../../utils/utils.js";

export async function setupUI() {
  $("#nav-icon").click(() => {
    $("#nav-icon").toggleClass("open");
    $("#sidebar").toggleClass("active");
  });

  $("#eye-icon").click(() => {
    let passwordField = $("#password");
    passwordField.attr(
      "type",
      passwordField.attr("type") === "password" ? "text" : "password"
    );

    $("#eye-icon").attr(
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
  hideItem("#loginCard");
  setTimeout(() => {
    $("#nav-icon").show().addClass("open");
    $("#sidebar").addClass("active").show();
    hideItem("#loader");
    hideItem("#loadError");
    showItem("#user-menu");
  }, 2000);
}
