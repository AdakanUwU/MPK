if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    const reg = await navigator.serviceWorker.register("/MPK/service-worker.js", {
      scope: "/MPK/"
    });

    console.log("SW działa w /MPK/");

    reg.onupdatefound = () => {
      const newWorker = reg.installing;

      newWorker.onstatechange = () => {
        if (newWorker.state === "installed") {
          if (navigator.serviceWorker.controller) {
            console.log("Nowa wersja – odświeżam...");
            window.location.reload();
          } else {
            console.log("Offline gotowy!");
          }
        }
      };
    };
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