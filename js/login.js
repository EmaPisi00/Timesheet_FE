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


$(document).ready(function(){
	$('#nav-icon4').click(function(){
		$(this).toggleClass('open');
	});
});
setTimeout(() => {
  $(`#loader`).hide();
  $(`#content`).show();
}, 2000);

function handleLogin() {
  event.preventDefault();

  const content = document.getElementById("loginCard");
  content.style.display = "none";

  const openBtn = document.getElementById("sidebar");
  openBtn.style.display = "block  ";
}

function closeSidebar() {
  const sidebar = document.getElementById("sidebar");
  const openBtn = document.getElementById("open-btn");

  sidebar.classList.add("hidden"); // Nasconde il menu
  openBtn.classList.remove("d-none"); // Mostra il pulsante "Apri Menu"
}

function openSidebar() {
  const sidebar = document.getElementById("sidebar");
  const openBtn = document.getElementById("open-btn");

  sidebar.classList.remove("hidden"); // Mostra il menu
  openBtn.classList.add("d-none"); // Nasconde il pulsante "Apri Menu"
}
