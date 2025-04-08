import { showConfirmationModal } from "../../../components/modal";

export async function handleActionClick(action, month, year, uuid) {
  switch (action) {
    case "delete":
      showConfirmationModal(action, month, year, uuid);
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
