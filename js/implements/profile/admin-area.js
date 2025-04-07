import employeeService from "../../service/employee-service.js";
import timesheetService from "../../service/timesheet-service.js";

const pageable = {
  page: 0,
  size: 10,
  sort: "",
};

// Chiamata all'API per ottenere i dati dei dipendenti
const responseEmployee = await employeeService.findAll(pageable);

// Chiamata all'API per ottenere i timesheet
const responseTimesheet = await timesheetService.findAll(pageable);

export async function loadEmployee() {
  // Seleziona la tabella dove aggiungere i dati
  const tableHtml = $("#employeeTable");

  // Pulisce la tabella (opzionale, nel caso si voglia sempre aggiornare i dati)
  tableHtml.find("tbody").empty();

  // Aggiungi tutte le righe alla tabella in una volta sola
  const rows = responseEmployee.content.map(createEmployeeRow).join("");
  tableHtml.append(`<tbody>${rows}</tbody>`);
}

export async function loadTimesheetEmployee() {
  // Seleziona la tabella dove aggiungere i dati
  const tableHtml = $("#adminTimesheetTable");

  // Pulisce la tabella (opzionale, nel caso si voglia sempre aggiornare i dati)
  tableHtml.find("tbody").empty();

  console.log(responseEmployee);
  console.log(responseTimesheet.content[0].employee.uuid);
  // Aggiungi tutte le righe alla tabella in una volta sola
  const rows = responseEmployee.content
    .map((employee) => {
      // Trova i timesheet associati a questo dipendente
      return responseTimesheet.content
        .filter((timesheet) => timesheet.employee.uuid === employee.uuid) // Filtra solo i timesheet di questo dipendente
        .map((timesheet, index) => {
          // Se è il primo timesheet di questo dipendente, inserisci il nome solo una volta
          const isFirstTimesheet = index === 0;
          return createTimesheetRow(employee, timesheet, isFirstTimesheet); // Crea la riga per il timesheet
        })
        .join(""); // Unisce tutte le righe per quel dipendente
    })
    .join(""); // Unisce tutte le righe per tutti i dipendenti

  // Aggiungi le righe alla tabella
  tableHtml.append(`<tbody>${rows}</tbody>`);
}

// Funzione che crea la riga HTML per un dipendente
const createEmployeeRow = (employee) => {
  return `
        <tr>
          <td>${employee.name}</td>
          <td>${employee.surname}</td>
          <td>
            <div class="dropdown">
              <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                Azioni
              </button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#">Elimina Utente</a></li>
                <li><a class="dropdown-item" href="#">Modifica Dati</a></li>
                <li><a class="dropdown-item" href="#">Visualizza Timesheet</a></li>
              </ul>
            </div>
          </td>
        </tr>
      `;
};

// Funzione che crea la riga HTML per un timesheet
const createTimesheetRow = (employee, timesheet, isFirstTimesheet) => {
  // Inizia con una riga HTML
  let row = "<tr>";

  // Aggiungi nome e cognome solo se è il primo timesheet di questo dipendente
  if (isFirstTimesheet) {
    row += `<td>${employee.name}</td><td>${employee.surname}</td>`;
  } else {
    row += `<td></td><td></td>`; // Lascia vuote le celle per gli altri timesheet
  }

  // Aggiungi gli altri dettagli del timesheet
  row += `
      <td>${timesheet.year}</td>
      <td>${timesheet.month}</td>
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
