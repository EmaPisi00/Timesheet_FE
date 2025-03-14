import { isEmpty, showItem, hideItem } from "./utils/utils.js";
import { generateTimesheet } from "./utils/table-utils.js";

export function setupTimesheet() {
  $("#timesheet").click(() => $("#containerGenerateTimesheet").show());

  $("#generateTimesheet").click(() => {
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

    generateTimesheet(year, month);
  });

  $("#monthsSelect, #yearsSelect").change(() => {
    if (!isEmpty($("#monthsSelect").val())) hideItem("#monthError");
    if (!isEmpty($("#yearsSelect").val())) hideItem("#yearError");
  });
}
