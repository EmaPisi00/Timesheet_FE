$(document).ready(function () {
  // Gestione del click sul pulsante di login
  $("#loginBtn").click(function (event) {
    event.preventDefault(); // Prevenire il comportamento di default del form

    // Mostra il loader e nasconde il form di login
    $("#loader").show();
    $("#loginCard").hide();

    // Usa setTimeout per fare le modifiche dopo 2 secondi
    setTimeout(() => {
      // Mostra il menu hamburger e la sidebar
      $("#nav-icon").show().addClass("open");
      $("#sidebar").addClass("active").show();

      // Nascondi il loader
      $("#loader").hide();
    }, 2000);
  });

  // Gestione del click per mostrare/nascondere la password
  $("#eye-icon").click(function () {
    var passwordField = $("#password");
    var eyeIcon = $("#eye-icon");
    if (passwordField.attr("type") === "password") {
      passwordField.attr("type", "text");
      eyeIcon.attr("src", "/assets/images/eye-open.png");
    } else {
      passwordField.attr("type", "password");
      eyeIcon.attr("src", "/assets/images/eye-icon.png");
    }
  });

  // Gestione del click per aprire/chiudere la navbar
  $("#nav-icon").click(function () {
    $(this).toggleClass("open"); // Aggiungi o rimuovi la classe "open"
    $("#sidebar").toggleClass("active"); // Aggiungi o rimuovi la classe "active" per la sidebar
  });

  // Funzione timeout
  setTimeout(() => {
    $(`#loader`).hide(); // Nasconde l'elemento con id hider
    $(`#content`).show(); // Mostra l'elemento con id shower
  }, 2000);
});
