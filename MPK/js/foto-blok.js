// Blokowanie prawego przycisku myszy tylko na zdjęciach
document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll("img");
  
    images.forEach(img => {
      img.addEventListener("contextmenu", function (e) {
        e.preventDefault();
      });
    });
  });