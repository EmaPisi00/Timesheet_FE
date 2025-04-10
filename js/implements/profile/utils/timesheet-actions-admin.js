import { showConfirmationModalTimesheet } from "../../../components/modal.js";
import timesheetService from "../../../service/timesheet-service.js";

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
      timesheetService.downloadTimesheet(uuid);
      break;
    default:
      alert("Azione non riconosciuta");
  }
}
