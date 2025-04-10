import { updatePagination } from "../../components/pagination.js";
import employeeService from "../../service/employee-service.js";
import timesheetService from "../../service/timesheet-service.js";
import userService from "../../service/user-service.js";
import { getMonthName } from "../../utils/date-utils.js";
import { isEmpty } from "../../utils/utils.js";
import {
  ActionsAdminAreaTimesheetCard,
  ActionsAdminAreaUserCard,
  basePageable,
  Operations,
} from "../../utils/constant.js";
import { handleActionClickEmployeeActions } from "./utils/employee-actions.js";
import { handleActionClickTimesheetActions } from "./utils/timesheet-actions-admin.js";

export async function setupAdminaArea() {
  // Chiamata all'API per ottenere i dati dei dipendenti
  const responseEmployee = await employeeService.findAll(basePageable);
  responseEmployee;
  if (!isEmpty(responseEmployee)) {
    loadEmployee(responseEmployee);
  }

  // Chiamata all'API per ottenere i timesheet
  const responseTimesheet = await timesheetService.findAll(basePageable);
  responseTimesheet;
  if (!isEmpty(responseTimesheet)) {
    loadTimesheetEmployee(responseTimesheet);
  }

  initializeTimesheetActions();
  initializeEmployeeActions();
}

export async function loadTimesheetEmployee(responseTimesheet) {
  // Seleziona la tabella dove aggiungere i dati
  const tableHtml = $("#adminTimesheetTable");

  // Pulisce la tabella (opzionale, nel caso si voglia sempre aggiornare i dati)
  tableHtml.find("tbody").empty();

  // Aggiungi tutte le righe alla tabella in una volta sola
  const rows = responseTimesheet.content.map(createTimesheetRow).join("");

  // Aggiungi le righe alla tabella
  tableHtml.append(`<tbody>${rows}</tbody>`);

  updatePagination(
    responseTimesheet,
    "#paginationTimesheetAdminContainer",
    Operations.SHOW_TIMESHEET_ADMIN
  );
}

export async function loadEmployee(responseEmployee) {
  // Seleziona la tabella dove aggiungere i dati
  const tableHtml = $("#employeeTable");

  // Pulisce la tabella (opzionale, nel caso si voglia sempre aggiornare i dati)
  tableHtml.find("tbody").empty();

  // Aggiungi tutte le righe alla tabella in una volta sola
  const rows = responseEmployee.content.map(createEmployeeRow).join("");
  tableHtml.append(`<tbody>${rows}</tbody>`);

  updatePagination(
    responseEmployee,
    "#paginationEmployeeAdminContainer",
    Operations.SHOW_EMPLOYEES_ADMIN
  );
}

export async function registerEmployee() {
  let email = $("#emailRegister").val();
  let password = $("#passwordRegister").val();
  let name = $("#nameRegister").val();
  let surname = $("#surnameRegister").val();

  const employee = {
    email: email,
    password: password,
    name: name,
    surname: surname,
  };

  const response = await userService.register(employee);

  if (!isEmpty(response)) {
    // Resetto il form in caso di inserimento
    $("#registrationForm")[0].reset();

    const responseEmployee = await employeeService.findAll(basePageable);
    loadEmployee(responseEmployee);
  }
}

// Funzione che crea la riga HTML per un dipendente
const createEmployeeRow = (employee) => {
  return `
        <tr>
          <td>${employee.name}</td>
          <td>${employee.surname}</td>
          <td>${employee.user.email}</td>
          <td>${employee.user.role}</td>
          <td>
            <div class="dropdown">
              <button class="btn btn-secondary dropdown-toggle btn-action-employee" type="button" data-bs-toggle="dropdown"
                data-uuid="${employee.user.uuid}">
                Azioni
              </button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item dropdown-item-employee" data-action="${ActionsAdminAreaUserCard.DELETE_USER}" href="#">Elimina Utente</a></li>
                <li><a class="dropdown-item dropdown-item-employee" data-action="${ActionsAdminAreaUserCard.EDIT_USER}" href="#">Modifica Dati</a></li>
                <li><a class="dropdown-item dropdown-item-employee" data-action="${ActionsAdminAreaUserCard.SHOW_TIMESHEET_USER}" href="#">Visualizza Timesheet</a></li>
               <li><a class="dropdown-item dropdown-item-employee" data-action="${ActionsAdminAreaUserCard.EDIT_ROLE_USER}" href="#">Modifica Ruolo</a></li>
              </ul>
            </div>
          </td>
        </tr>
      `;
};

// Funzione che crea la riga HTML per un timesheet
const createTimesheetRow = (timesheet) => {
  // Inizia con una riga HTML
  let row = "<tr>";

  console.log(timesheet);

  // Aggiungi gli altri dettagli del timesheet
  row += `
      <td>${timesheet.name}</td>
      <td>${timesheet.surname}</td>
      <td>${getMonthName(timesheet.month)}</td>
      <td>${timesheet.year}</td>
       <td>${
         !timesheet.locked
           ? `<i class="fa-solid fa-xmark"></i>`
           : `<i class="fa-solid fa-check"></i>`
       }</td>
      <td>
        <div class="dropdown">
          <button class="btn btn-secondary dropdown-toggle btn-action-timesheet" type="button" data-bs-toggle="dropdown"
            data-uuid="${timesheet.uuidTimesheet}"
            data-month="${timesheet.month}"
            data-year="${timesheet.year}"
            data-name="${timesheet.name}"
            data-surname="${timesheet.surname}">
            Azioni
          </button>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item dropdown-item-timesheet" data-action="${
              ActionsAdminAreaTimesheetCard.DELETE_TIMESHEET
            }" href="#">Elimina</a></li>
            <li><a class="dropdown-item dropdown-item-timesheet" data-action="${
              ActionsAdminAreaTimesheetCard.DOWNLOAD_TIMESHEET
            }" href="#">Scarica</a></li>
          </ul>
        </div>
      </td>
    </tr>`;

  return row;
};

function initializeTimesheetActions() {
  $(document).on("click", ".dropdown-item-timesheet", function (e) {
    e.preventDefault();

    const action = $(this).data("action");
    const uuid = $(this)
      .closest(".dropdown")
      .find(".btn-action-timesheet")
      .data("uuid");
    const month = $(this)
      .closest(".dropdown")
      .find(".btn-action-timesheet")
      .data("month");
    const year = $(this)
      .closest(".dropdown")
      .find(".btn-action-timesheet")
      .data("year");
    const name = $(this)
      .closest(".dropdown")
      .find(".btn-action-timesheet")
      .data("name");
    const surname = $(this)
      .closest(".dropdown")
      .find(".btn-action-timesheet")
      .data("surname");

    handleActionClickTimesheetActions(action, uuid, month, year, name, surname);
  });
}

function initializeEmployeeActions() {
  $(document).on("click", ".dropdown-item-employee", function (e) {
    e.preventDefault();

    const action = $(this).data("action");
    const uuid = $(this)
      .closest(".dropdown")
      .find(".btn-action-employee")
      .data("uuid");

    handleActionClickEmployeeActions(action, uuid);
  });
}
