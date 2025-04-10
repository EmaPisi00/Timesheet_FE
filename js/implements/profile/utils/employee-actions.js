import { showConfirmationModalEmployee } from "../../../components/modal.js";

export async function handleActionClickEmployeeActions(action, uuid) {
  switch (action) {
    case 1:
      showConfirmationModalEmployee(action, uuid);
      break;
    case 2:
      alert("CLICK EDIT");
      break;
    case 3:
      alert("CLICK ROLE");
      break;
    case 4:
      alert("CLICK SHOW");
      break;
    default:
      alert("Azione non riconosciuta");
  }
}
