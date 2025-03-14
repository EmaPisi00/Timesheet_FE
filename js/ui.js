import { hideItem } from "./utils/utils.js";

export function setupUI() {
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

  $("#home, #showTimesheet").click(() =>
    hideItem("#containerGenerateTimesheet")
  );
}

export function showAuthenticatedUI() {
  hideItem("#loginCard");
  setTimeout(() => {
    $("#nav-icon").show().addClass("open");
    $("#sidebar").addClass("active").show();
    hideItem("#loader");
    hideItem("#loadError");
  }, 2000);
}
