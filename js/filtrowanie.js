const atrybutyMap = {
    przeg: "Pojazd przegubowy",
    niskopodlogowy: "Pojazd niskopodłogowy",
    ac: "Pojazd klimatyzowany",
    kamery: "Pojazd monitorowany",
    usb: "Pojazd wyposażony w ładowarki USB",
    wifi: "Sieć WIFI w pojeździe",
    biletomat: "Biletomat w pojeździe",
    biletkier: "Bilety sprzedawane u kierowcy",
    ev: "Napęd elektryczny",
    cng: "Napęd CNG",
    tram: "Tramwaj"
};

function filtrujTabele() {
const model = document.getElementById("filtrModel").value.toLowerCase();
const malowanie = document.getElementById("filtrMalowanie").value.toLowerCase();
const rok = document.getElementById("filtrRok").value;
const atrybut = document.getElementById("filtrAtrybuty").value.toLowerCase();

const tabela = document.querySelector(".spis");
const wiersze = tabela.querySelectorAll("tr.tabela_link");

wiersze.forEach(wiersz => {
    const komorki = wiersz.getElementsByTagName("td");

    const valModel = komorki[1]?.textContent.toLowerCase() || "";
    const valMalowanie = komorki[2]?.textContent.toLowerCase() || "";
    const valRok = komorki[3]?.textContent || "";
    const imgTytuly = Array.from(komorki[4]?.querySelectorAll("img[title]") || []).map(img => img.title.toLowerCase());

    const widoczny =
    valModel.includes(model) &&
    (malowanie === "" || valMalowanie === malowanie) &&
    valRok.includes(rok) &&
    (atrybut === "" || imgTytuly.includes(atrybut));

    wiersz.style.display = widoczny ? "" : "none";
});
}


window.addEventListener("DOMContentLoaded", () => {
const tabela = document.querySelector(".spis");
const wiersze = tabela.querySelectorAll("tr.tabela_link");

const malowanieSet = new Set();
const atrybutSet = new Set();

wiersze.forEach(wiersz => {
    const td = wiersz.getElementsByTagName("td");

    // Malowanie
    const malowanie = td[2]?.textContent.trim();
    if (malowanie) malowanieSet.add(malowanie);

    // Atrybuty: przeszukaj <img> w komórce
    const atrybutyIkony = td[4]?.querySelectorAll("img[title]") || [];
    atrybutyIkony.forEach(img => atrybutSet.add(img.getAttribute("title")));
});

// Wstaw do selecta Malowanie
const selectMalowanie = document.getElementById("filtrMalowanie");
[...malowanieSet].sort().forEach(opcja => {
    const opt = document.createElement("option");
    opt.value = opcja;
    opt.textContent = opcja;
    selectMalowanie.appendChild(opt);
});

// Wstaw do selecta Atrybuty
const selectAtrybuty = document.getElementById("filtrAtrybuty");
[...atrybutSet].sort().forEach(opcja => {
    const opt = document.createElement("option");
    opt.value = opcja;
    opt.textContent = opcja;
    selectAtrybuty.appendChild(opt);
});
});