export function loadJsonConfig(path: string): Promise<any> {
  return fetch(`/assets/${path}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load config: ${response.statusText}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error(`Error loading JSON from ${path}:`, error);
      return Promise.reject(error); // Reject the promise so the caller knows it failed
    });
}
