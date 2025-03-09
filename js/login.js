function togglePassword() {
  var passwordField = $(`#password`);
  var eyeIcon = $(`#eye-icon`);

  if (passwordField.attr("type") === "password") {
    passwordField.attr("type", "text");
    eyeIcon.attr("src", "/assets/images/eye-open.png");
  } else {
    passwordField.attr("type", "password");
    eyeIcon.attr("src", "/assets/images/eye-icon.png");
  }
}

setTimeout(() => {
  $(`#loader`).hide();
  $(`#content`).show();
}, 2000);

function handleLogin() {
  event.preventDefault();

  // Nascondi il login form
  const content = document.getElementById("loginCard");
  content.style.display = "none";

  // Mostra il menu hamburger
  const openBtn = document.getElementById("nav-icon");
  openBtn.style.display = "block";

  // Aggiungi la classe 'active' alla sidebar al caricamento
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.add("active");

  openBtn.classList.add("open");
}

$(document).ready(function () {
  // Gestisci il click sul pulsante per togglare il menu
  $("#nav-icon").click(function () {
    $(this).toggleClass("open"); // Aggiungi o rimuovi la "X"
    $("#sidebar").toggleClass("active"); // Aggiungi o rimuovi la visibilità della sidebar
  });
});
