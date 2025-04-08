export const Constant = Object.freeze({
  API_URL: "http://localhost:8080/api/v1",
  ERROR_MESSAGE: "Si è verificato un errore!",
  SUCCESS_MESSAGE: "Operazione riuscita!",
});

export const OptionStatusDay = {
  WORKDAY: "Lavorativo",
  HOLIDAY: "Ferie",
  ILLNESS: "Malattia",
  SMART_WORKING: "Smart-Working",
};

export const OptionStatusDayArray = Object.entries(OptionStatusDay).map(
  ([key, value]) => ({
    value: key, // Nome dell'enum (es. "WORKDAY")
    label: value, // Traduzione (es. "Lavorativo")
  })
);

export const basePageable = {
  page: 0,
  size: 10,
  sort: "",
};

export const Operations = {
  SHOW_TIMESHEET_USER: 1,
  SHOW_TIMESHEET_ADMIN: 2,
  SHOW_EMPLOYEES_ADMIN: 3,
};
