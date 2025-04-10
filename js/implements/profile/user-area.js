import { hideItem, showItem } from "../../utils/utils.js";

export async function setupUseraArea() {
  // Area Utente
  $("#userArea").click(() => {
    showItem("#userAreaContainer");

    hideItem("#containerGenerateTimesheet");
    hideItem("#showTimesheet");
    hideItem("#containerAdminArea");
  });
}
