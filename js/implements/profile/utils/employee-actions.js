import { showConfirmationModalEmployee } from "../../../components/modal.js";
export async function handleActionClick(action, uuid) {
  switch (action) {
    case "delete":
      showConfirmationModalEmployee(action, uuid);
      break;
    case "edit":
      break;
    case "showTimesheet":
      break;
    case "editRoleUser":
      break;
    default:
      alert("Azione non riconosciuta");
  }
}
