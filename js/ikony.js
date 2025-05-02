const base = document.baseURI.endsWith('/') ? document.baseURI : document.baseURI + '/';

document.addEventListener("DOMContentLoaded", () => {
    console.log("Skrypt załadowany");
  
    // Definicja mapowania skrótów na HTML dla ikon
    const icons = {
      przeg: '<img src="ikony/przeg.svg" height="20" class="atr" title="Pojazd przegubowy">',
      niskopodlogowy: '<img src="ikony/niskopodłogowy.svg" height="20" class="atr" title="Pojazd niskopodłogowy">',
      ac: '<img src="ikony/AC.svg" height="20" class="atr" title="Pojazd klimatyzowany">',
      kamery: '<img src="ikony/kamera.svg" height="20" class="atr" title="Pojazd monitorowany">',
      usb: '<img src="ikony/USB.svg" height="20" class="atr" title="Pojazd wyposażony w ładowarki USB">',
      wifi: '<img src="ikony/WIFI.svg" height="20" class="atr" title="Sieć WIFI w pojeździe">',
      biletomat: '<img src="ikony/biletomat.svg" height="20" class="atr" title="Biletomat w pojeździe">',
      biletkier: '<img src="ikony/bilet-kier.svg" height="20" class="atr" title="Bilety sprzedawane u kierowcy">',
      ev: '<img src="ikony/ev.svg" height="20" class="atr" title="Napęd elektryczny">',
      cng: '<img src="ikony/cng.svg" height="20" class="atr" title="Napęd CNG">',
      gps1: '<img src="ikony/gps1.svg" height="20" class="gps" title="Lokalizacja GPS">',
      gps2: '<img src="ikony/gps2.svg" height="20" class="gps" title="Lokalizacja GPS">',
      tram: '<img src="ikony/tramwaj.svg" height="20" class="atr" title="Tramwaj">'
    };
  
    // Funkcja do zamiany skrótów na obrazy
    function replaceShortcutsWithIcons() {
      let bodyContent = document.body.innerHTML;  // Pobieramy całą zawartość strony
  
      // Wyrażenie regularne do wyszukiwania tagów <skrót>, z uwzględnieniem różnych wielkości liter
      const iconRegex = /<(\w+)>/g;
  
      // Zastępujemy wszystkie wystąpienia w treści strony
      const updatedContent = bodyContent.replace(iconRegex, (match, iconName) => {
        // Normalizujemy nazwę skrótu na małe litery (np. <AC> na <ac>)
        const normalizedIconName = iconName.toLowerCase();
        
        // Sprawdzamy, czy istnieje ikona w obiekcie
        return icons[normalizedIconName] || match; // Jeśli nie znajdzie ikony, zostawi oryginalny skrót
      });
  
      // Aktualizujemy zawartość strony
      document.body.innerHTML = updatedContent;
    }
  
    // Wywołanie funkcji po załadowaniu strony
    replaceShortcutsWithIcons();
  });
  