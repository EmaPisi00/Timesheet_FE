export async function ajaxCall(url, method, data = null, token = null) {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    // Se è presente un token, aggiungilo nell'header Authorization
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: method,
      headers: headers,
      body: data ? JSON.stringify(data) : null,
    });

    if (!response.ok) {
      throw new Error(`Errore HTTP: ${response.status}`);
    }

 

    return await response.json();
  } catch (error) {
    console.error("Errore nella chiamata AJAX:", error);
    throw error;
  }
}
