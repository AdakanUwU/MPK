if ('serviceWorker' in navigator) {
  // Czekamy, aż strona się załaduje
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/MPK/js/service-worker.js')
      .then(registration => {
        console.log('Service Worker zarejestrowany:', registration.scope);
      })
      .catch(error => {
        console.error('Błąd rejestracji Service Workera:', error);
      });
  });
}

// Tutaj możesz dodać swoją logikę aplikacji
// np. dynamiczne przyciski, API fetch, animacje itd.

document.addEventListener('DOMContentLoaded', () => {
  console.log('Twoja PWA działa poprawnie!');
  // Przykładowa funkcja: powitanie użytkownika
  const body = document.querySelector('body');
  const welcome = document.createElement('p');
  welcome.textContent = 'Witaj w MPK Częstochowa!';
  body.appendChild(welcome);
});