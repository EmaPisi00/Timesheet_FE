import { showConfirmationModalShowTimesheet } from "../../../components/modal.js";
import { getProfile } from "../../auth/auth.js";
import { hideItem, showItem, showToast } from "../../../utils/utils.js";
import { generateTimesheet } from "../generate-timesheet.js";
import timesheetService from "../../../service/timesheet-service.js";
import { ActionsShowTimesheet } from "../../../utils/constant.js";

export async function handleActionClick(action, month, year, uuid) {
  switch (action) {
    case 1:
      editTimesheet(month, year);
      break;
    case 2:
      alert(`Visualizzazione dettagliata del timesheet per ${month}/${year}`);
      break;
    case 3:
      showConfirmationModalShowTimesheet(
        ActionsShowTimesheet.DELETE_TIMESHEET,
        month,
        year,
        uuid
      );
      break;
    case 4:
      showConfirmationModalShowTimesheet(
        ActionsShowTimesheet.LOCK_TIMESHEET,
        month,
        year,
        uuid
      );
      break;
    case 5:
      await timesheetService.downloadTimesheet(uuid);
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
    if (responseSaveTimesheet === 500) {
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
