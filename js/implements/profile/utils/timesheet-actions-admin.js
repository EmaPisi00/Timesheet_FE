import { showConfirmationModalTimesheet } from "../../../components/modal.js";

export async function handleActionClickTimesheetActions(
  action,
  uuid,
  month,
  year,
  name,
  surname
) {
  switch (action) {
    case 1:
      showConfirmationModalTimesheet(action, uuid, month, year, name, surname);
      break;
    case 2:
      alert("CLICK EDIT");
      break;
    default:
      alert("Azione non riconosciuta");
  }
}
