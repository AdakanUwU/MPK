document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll(".fullscreen-img");
    const overlay = document.getElementById("fullscreenOverlay");
    const fullscreenImage = document.getElementById("fullscreenImage");
    const closeBtn = document.getElementById("closeBtn");
  
    images.forEach(image => {
      image.addEventListener("click", () => {
        fullscreenImage.src = image.src;
        overlay.classList.add("show");
      });
    });
  
    closeBtn.addEventListener("click", () => {
      // Dodajemy animacje wychodzenia zdjęcia
      fullscreenImage.style.animation = "zoomOut 0.3s forwards";
      overlay.style.animation = "fadeOut 0.5s forwards";
      
      // Po zakończeniu animacji usuwamy klasy
      setTimeout(() => {
        overlay.classList.remove("show");
        fullscreenImage.style.animation = ""; // Resetowanie animacji
        overlay.style.animation = ""; // Resetowanie animacji
      }, 500); // Czas animacji (500ms)
    });
  
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        // Dodajemy animacje wychodzenia zdjęcia
        fullscreenImage.style.animation = "zoomOut 0.3s forwards";
        overlay.style.animation = "fadeOut 0.5s forwards";
        
        // Po zakończeniu animacji usuwamy klasy
        setTimeout(() => {
          overlay.classList.remove("show");
          fullscreenImage.style.animation = ""; // Resetowanie animacji
          overlay.style.animation = ""; // Resetowanie animacji
        }, 500); // Czas animacji (500ms)
      }
    });
  });
  