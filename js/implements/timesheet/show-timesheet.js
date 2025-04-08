import { hideItem, showItem } from "../../utils/utils.js";
import { getMonthName } from "../../utils/date-utils.js";
import { updatePagination } from "../../components/pagination.js";
import { enableLinks } from "../../utils/utils.js";
import { handleActionClick } from "./utils/timesheet-actions.js";
import { Operations } from "../../utils/constant.js";

export const showTimesheet = (timesheetRequests, employee, pagination) => {
  const datatableTimesheet = $("#datatableTimesheet");

  if (timesheetRequests.length === 0) {
    datatableTimesheet.html(
      '<div class="alert alert-warning">Nessun risultato trovato.</div>'
    );
    hideItem("#loader-show-timesheet");
    showItem("#datatableTimesheet");
    showItem("#titleShowTimesheet");
    return;
  }

  let tableHTML = `
    <table class="table table-hover">
      <thead>
        <tr>
          <th style="width: 15%;">Mese</th>
          <th style="width: 15%;">Anno</th>
          <th style="width: 20%;">Totale Ore Lavorate</th>
          <th style="width: 50%;">Azioni</th>
        </tr>
      </thead>
      <tbody>`;

  $.each(timesheetRequests, function (index, timesheetRequest) {
    const totalHours = calculateTotalHours(timesheetRequest.presenceList);
    const data = {
      mese: getMonthName(timesheetRequest.month),
      anno: timesheetRequest.year,
      totaleOreLavorate: totalHours,
    };

    tableHTML += generateRow(data, timesheetRequest);
  });

  tableHTML += "</tbody></table>";
  datatableTimesheet.html(tableHTML);

  hideItem("#loader-show-timesheet");
  showItem("#datatableTimesheet");
  showItem("#titleShowTimesheet");
  showItem("#paginationTimesheetContainer");

  updatePagination(
    pagination,
    "#paginationTimesheetContainer",
    Operations.SHOW_TIMESHEET_USER
  );
  enableLinks();

  // Aggiungi il gestore di clic alle azioni
  $(".btn-action").on("click", function () {
    const action = $(this).data("action");
    const month = $(this).data("month");
    const year = $(this).data("year");
    const uuid = $(this).data("uuid");

    handleActionClick(action, month, year, uuid); // Chiamata alla funzione handleActionClick
  });
};

function generateRow(data, timesheetRequest) {
  let row = "<tr>";
  $.each(data, function (key, value) {
    row += `<td>${value}</td>`;
  });

  row += '<td class="actions" id="actionsShowTimesheet">';

  const actions = [
    { icon: "fas fa-edit", title: "Modifica", action: "edit" },
    { icon: "fas fa-eye", title: "Visualizza Dettaglio", action: "view" },
    { icon: "fas fa-trash-alt", title: "Cancellazione", action: "delete" },
    {
      icon: "fas fa-lock",
      title: "Blocca",
      action: "block",
      disableIfLocked: true,
    },
    {
      icon: "fas fa-download",
      title: "Download",
      action: "download",
      enableIfLocked: true,
    },
  ];

  $.each(actions, function (index, action) {
    let isDisabled = false;
    let iconColor = "color: #333;";

    // Controllo se l'azione è "block" e il timesheet è bloccato
    if (action.disableIfLocked && timesheetRequest.locked) {
      isDisabled = true;
      iconColor = "color: #ccc; cursor: not-allowed;";
    }

    // Controllo se l'azione è "download" e il timesheet NON è bloccato
    if (action.enableIfLocked && !timesheetRequest.locked) {
      isDisabled = true;
      iconColor = "color: #ccc; cursor: not-allowed;";
    }

    const disabledAttr = isDisabled ? "disabled" : "";

    row += `
      <button class="btn btn-link p-0 border-0 shadow-none btn-action"  
              data-action="${action.action}" 
              data-month="${timesheetRequest.month}" 
              data-year="${timesheetRequest.year}" 
              data-uuid="${timesheetRequest.uuid}" 
              title="${action.title}" 
              id="actionButtons"
              ${disabledAttr}>
        <i class="${action.icon}" id="iconsActionsShowTimesheet" style="font-size: 16px; ${iconColor}"></i>
      </button>
    `;
  });

  row += "</td></tr>";
  return row;
}

function calculateTotalHours(presenceList) {
  return presenceList.reduce((total, day) => {
    return day.totalHours ? total + day.totalHours : total;
  }, 0);
}
