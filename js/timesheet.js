import { isEmpty, showItem, hideItem } from "./utils/utils.js";
import { generateTimesheet } from "./utils/table-utils.js";
import timesheetService from "./service/timesheet-service.js";
import userService from "./service/user-service.js";

export function setupTimesheet() {
  $("#timesheet").click(() => $("#containerGenerateTimesheet").show());

  $("#generateTimesheet").click(async () => {
    let month = parseInt($("#monthsSelect").val(), 10);
    let year = parseInt($("#yearsSelect").val(), 10);

    if (isEmpty(month) || isNaN(month)) {
      showItem("#monthError");
      return;
    } else hideItem("#monthError");

    if (isEmpty(year) || isNaN(year)) {
      showItem("#yearError");
      return;
    } else hideItem("#yearError");

    const userProfile = await userService.getUserProfile();
    const response =
      await timesheetService.generateTimesheetByMonthAndYearAndEmployee(
        month,
        year,
        userProfile.uuidEmployee
      );

    if (response === 400) {
      alert("Errore timesheet esistente");
    } else {
      console.log(response);
      generateTimesheet(year, month, response.presenceList);
    }
  });

  $("#monthsSelect, #yearsSelect").change(() => {
    if (!isEmpty($("#monthsSelect").val())) hideItem("#monthError");
    if (!isEmpty($("#yearsSelect").val())) hideItem("#yearError");
  });
}
