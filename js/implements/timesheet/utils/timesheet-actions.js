import { showConfirmationModalShowTimesheet } from "../../../components/modal.js";
import { getProfile } from "../../auth/auth.js";
import { hideItem, showItem, showToast } from "../../../utils/utils.js";
import { generateTimesheet } from "../generate-timesheet.js";
import timesheetService from "../../../service/timesheet-service.js";

export async function handleActionClick(action, month, year, uuid) {
  switch (action) {
    case "edit":
      editTimesheet(month, year);
      break;
    case "view":
      alert(`Visualizzazione dettagliata del timesheet per ${month}/${year}`);
      break;
    case "delete":
      deleteTimesheet(month, year, uuid);
      break;
    case "block":
      blockTimesheet(month, year, uuid);
      break;
    case "download":
      dowloadTimesheet(uuid);
      break;
    default:
      alert("Azione non riconosciuta");
  }
}

// Funzione di edit timesheet
async function editTimesheet(month, year) {
  const userProfile = getProfile();
  if (userProfile) {
    const responseSaveTimesheet =
      await timesheetService.generateTimesheetByMonthAndYearAndEmployee(
        month,
        year,
        userProfile.uuidEmployee
      );
    if (responseSaveTimesheet === 400) {
      showToast(
        "Timesheet Bloccato, non è più possibile modificare il mese",
        "bg-danger"
      );
    } else {
      if (responseSaveTimesheet && responseSaveTimesheet.timesheetDto) {
        hideItem("#datatableTimesheet");
        hideItem("#showTimesheet");
        hideItem("#paginationTimesheetContainer");
        showItem("#containerGenerateTimesheet");
        generateTimesheet(year, month, responseSaveTimesheet);
      }
    }
  }
}

// Funzione che permette di eliminare un timesheet
async function deleteTimesheet(month, year, uuid) {
  showConfirmationModalShowTimesheet("delete", month, year, uuid); // Per eliminare il timesheet
}

// Funzione che permette di lockare il timesheet
async function blockTimesheet(month, year, uuid) {
  showConfirmationModalShowTimesheet("block", month, year, uuid); // Per bloccare il timesheet
}

// Funzione che permette di scaricare il timesheet
async function dowloadTimesheet(uuid) {
  await timesheetService.downloadTimesheet(uuid);
}
