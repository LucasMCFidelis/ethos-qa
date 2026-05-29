export function getApiUrl(): string {
  const apiUrl = Cypress.expose("apiUrl");

  if (!apiUrl) {
    throw new Error("API URL is not defined in Cypress configuration.");
  }
  
  return apiUrl;
}
