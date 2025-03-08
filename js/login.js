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
