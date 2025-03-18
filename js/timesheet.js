import { isEmpty, showItem, hideItem } from "./utils/utils.js";
import { generateTimesheet, extractPresenceData } from "./utils/table-utils.js";
import timesheetService from "./service/timesheet-service.js";
import userService from "./service/user-service.js";

let response = null;
let month = 0;
let year = 0;

export function setupTimesheet() {
  $("#timesheet").click(() => $("#containerGenerateTimesheet").show());

  $("#generateTimesheet").click(async () => {
    month = parseInt($("#monthsSelect").val(), 10);
    year = parseInt($("#yearsSelect").val(), 10);

    if (isEmpty(month) || isNaN(month)) {
      showItem("#monthError");
      return;
    } else hideItem("#monthError");

    if (isEmpty(year) || isNaN(year)) {
      showItem("#yearError");
      return;
    } else hideItem("#yearError");

    const userProfile = await userService.getUserProfile();
    response =
      await timesheetService.generateTimesheetByMonthAndYearAndEmployee(
        month,
        year,
        userProfile.uuidEmployee
      );

    if (response === 400) {
      alert("Errore timesheet esistente");
    } else {
      console.log(response);
      generateTimesheet(year, month, response);
    }
  });

  $("#monthsSelect, #yearsSelect").change(() => {
    if (!isEmpty($("#monthsSelect").val())) hideItem("#monthError");
    if (!isEmpty($("#yearsSelect").val())) hideItem("#yearError");
  });
}

$("#saveTimesheet").click(async () => {
  const presenceData = extractPresenceData(year, month);

  let timesheetRequestDto = {
    timesheetDto: response.timesheetDto,
    presenceList: presenceData,
  };

  const risposta = timesheetService.saveTimesheet(timesheetRequestDto);

  console.log(risposta);
});
