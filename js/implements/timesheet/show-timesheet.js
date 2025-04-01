import { hideItem, showItem } from "../../utils/utils.js";
import { getMonthName } from "../../utils/date-utils.js";
import { updatePagination } from "../../components/pagination.js";
import { enableLinks } from "../../utils/utils.js";
import { handleActionClick } from "./utils/timesheetActions.js";

export const showTimesheet = (timesheetRequests, employee, pagination) => {
  const datatableTimesheet = $("#datatableTimesheet");

  if (timesheetRequests.length === 0) {
    datatableTimesheet.html(
      '<div class="alert alert-warning">Nessun risultato trovato.</div>'
    );
    hideItem("#loader-show-timesheet");
    showItem("#titleShowTimesheet");
    return;
  }

  let tableHTML = `
    <table class="table table-striped">
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
  showItem("#paginationContainer");

  updatePagination(pagination);
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
    { icon: "fas fa-lock", title: "Blocca", action: "block" },
    { icon: "fas fa-download", title: "Download", action: "download" },
  ];

  $.each(actions, function (index, action) {
    row += `
      <button class="btn btn-link p-0 border-0 shadow-none btn-action"  
              data-action="${action.action}" 
              data-month="${timesheetRequest.month}" 
              data-year="${timesheetRequest.year}" 
              data-uuid="${timesheetRequest.uuid}" 
              title="${action.title}" 
              style="margin-right: 20px; ">
        <i class="${action.icon}" id="iconsActionsShowTimesheet"></i>
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
