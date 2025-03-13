// base-service.js
export async function ajaxCall(url, method, data, token) {
  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);

    // Se la risposta è ok (status 200-299)
    if (!response.ok) {
      throw new Error(`Errore nella chiamata: ${response.statusText}`);
    }

    // Restituisci la risposta come JSON
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Errore durante la chiamata AJAX:", error);
    throw error; // Rilancia l'errore per la gestione nel chiamante
  }
}
