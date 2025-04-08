import { updatePagination } from "../../components/pagination.js";
import employeeService from "../../service/employee-service.js";
import timesheetService from "../../service/timesheet-service.js";
import userService from "../../service/user-service.js";
import { getMonthName } from "../../utils/date-utils.js";
import { isEmpty } from "../../utils/utils.js";
import { basePageable } from "../../utils/constant.js";
import { handleActionClick } from "./utils/employee-actions.js";

export async function setupAdminaArea() {
  // Chiamata all'API per ottenere i dati dei dipendenti
  const responseEmployee = await employeeService.findAll(basePageable);
  console.log(responseEmployee);
  if (!isEmpty(responseEmployee)) {
    loadEmployee(responseEmployee);
  }

  // Chiamata all'API per ottenere i timesheet
  const responseTimesheet = await timesheetService.findAll(basePageable);
  console.log(responseTimesheet);
  if (!isEmpty(responseTimesheet)) {
    loadTimesheetEmployee(responseTimesheet);
  }
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
    "showTimesheetAdmin"
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
    "showEmployeesAdmin"
  );

  // Caricamento azioni sui dipendenti

  $(".btn-action-employee").on("click", function () {
    const uuid = $(this).data("uuid");
    handleActionClick("delete", uuid); // Chiamata alla funzione handleActionClick
  });
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
                <li><a class="dropdown-item" id="deleteUserFromAdmin" href="#">Elimina Utente</a></li>
                <li><a class="dropdown-item" href="#">Modifica Dati</a></li>
                <li><a class="dropdown-item" href="#">Visualizza Timesheet</a></li>
                <li><a class="dropdown-item" href="#">Modifica Ruolo</a></li>
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
          <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
            Azioni
          </button>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#">Elimina</a></li>
            <li><a class="dropdown-item" href="#">Modifica</a></li>
            <li><a class="dropdown-item" href="#">Scarica</a></li>
          </ul>
        </div>
      </td>
    </tr>`;

  return row;
};
