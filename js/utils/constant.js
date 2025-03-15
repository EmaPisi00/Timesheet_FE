export const Constant = Object.freeze({
  API_URL: "http://localhost:8080/api/v1",
  ERROR_MESSAGE: "Si è verificato un errore!",
  SUCCESS_MESSAGE: "Operazione riuscita!",
});

export const OptionStatusDay = {
  WORKDAY: "Lavorativo",
  HOLIDAY: "Ferie",
  ILLNESS: "Malattia",
  SMART_WORKING: "Smart-Working"
};

export const OptionStatusDayArray = Object.entries(OptionStatusDay).map(([key, value]) => ({
  value: key, // Nome dell'enum (es. "WORKDAY")
  label: value // Traduzione (es. "Lavorativo")
}));
