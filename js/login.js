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