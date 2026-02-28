let linesData = [];
let vehiclesData = [];
let databaseData = [];

// Funkcje do ładowania danych z plików JSON
const loadLinesData = async () => {
    const response = await fetch('https://live.mpk.czest.pl/api/lines');
    if (!response.ok) throw new Error("Błąd pobierania lines");
    linesData = await response.json();
};

const loadVehiclesData = async () => {
    const response = await fetch('https://live.mpk.czest.pl/api/vehicles');
    if (!response.ok) throw new Error("Błąd pobierania vehicles");
    vehiclesData = await response.json();
};

const loadDatabaseData = async () => {
    const response = await fetch('https://live.mpk.czest.pl/vehicles_base/database.json');
    if (!response.ok) throw new Error("Błąd pobierania database");
    databaseData = await response.json();
};

const historyPath = path.join(__dirname, 'history.json');

const loadHistory = async () => {
    try {
        const data = await fs.readFile(historyPath, 'utf-8');
        return JSON.parse(data);
    } catch {
        return {};
    }
};

const createBackup = async () => {
    try {
        const history = await loadHistory();
        const now = new Date();
        const stamp = now.toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(__dirname, `history-backup-${stamp}.json`);
        await fs.writeFile(backupPath, JSON.stringify(history, null, 2));
        console.log("Backup utworzony:", backupPath);
    } catch (err) {
        console.error("Błąd podczas tworzenia backupu:", err);
    }
};

const saveHistory = async (history) => {
    if (!history || Object.keys(history).length === 0) {
        console.log("Historia jest pusta — zapis anulowany.");
        return;
    }

    await createBackup();
    await fs.writeFile(historyPath, JSON.stringify(history, null, 2));
};

const getModelBySideNo = (sideNo) => {
    console.log(`Wyszukiwanie modelu dla numeru taborowego: ${sideNo}`); // Logowanie numeru taborowego

    const sideNumbers = sideNo.split('/'); // Dzielimy na wagon przedni i tylny
    let model = null;

    // Szukamy modelu dla przedniego wagonu
    if (sideNumbers.length > 0) {
        const frontWagon = sideNumbers[0].trim(); // Numer przedniego wagonu
        model = databaseData.find(db => db.sideNo === frontWagon)?.model;
        console.log(`Sprawdzam wagon przedni: ${frontWagon}, model: ${model || 'Nie znaleziono'}`); // Logowanie wyniku
    }

    // Jeśli nie znaleziono modelu dla przedniego wagonu, sprawdzamy tylny
    if (!model && sideNumbers.length > 1) {
        const rearWagon = sideNumbers[1].trim(); // Numer tylnego wagonu
        model = databaseData.find(db => db.sideNo === rearWagon)?.model;
        console.log(`Sprawdzam wagon tylny: ${rearWagon}, model: ${model || 'Nie znaleziono'}`); // Logowanie wyniku
    }

    return model || null; // Zwracamy model lub null
};

async function updateHistory() {
    await loadLinesData();
    await loadVehiclesData();
    await loadDatabaseData();


    const busStops = [
        "d7e66f5d-f797-4b77-ae77-896382d11271",  //==Plac Daszyńskiego 01 (10, 11, 12, 13, 14, 17, 18, 20, 23, 24, 26, 27, 31, 34, 37)
        "3243c09c-07ec-4689-9ac4-9f84742a8129",  //==Plac Biegańskiego 03 (11, 13, 19, 21, 22, 25, 32, 33)
        "77f8fd2d-5438-4d4b-a456-5eedcf801fae",  //==Domy Studenckie 02 (15, 16, 25, 28, 29)
        "b595724b-639a-4911-8d27-236df1d4b7b8",  //==Powstańców Śląskich 04 (35, 38, 80)
        "ced57f35-b2cb-4ac4-8ea3-b1de51b81fbe",  //==Wyczerpy Górne 02 (30)
        "c3019e37-a433-4b36-9b0c-b03dd430a7a3",  //==Równoległa 01 (1, 2, 3 -Fieldorfa)
        "0fbb4646-f523-45cf-bb35-43b09d40a490"   //==Powstańców Śląskich 02 (1, 2, 3)
    ];

    const year = req.params.year;
    const month = req.params.month;
    const day = req.params.day;

    let dateObj;

    if (year && month && day) {
        dateObj = new Date(`${year}-${month}-${day}`);
    } else {
        dateObj = new Date();
    }

    const finalYear = dateObj.getFullYear();
    const finalMonth = String(dateObj.getMonth() + 1).padStart(2, '0');
    const finalDay = String(dateObj.getDate()).padStart(2, '0');
    const dateKey = `${finalYear}-${finalMonth}-${finalDay}`;

    const checkedLines = new Set();
    const vehiclesMap = new Map();

    try {

        for (const stopId of busStops) {

            const url = `https://live.mpk.czest.pl/api/locations/${stopId}/timetables/${finalYear}/${finalMonth}/${finalDay}`;
            const response = await fetch(url);
            if (!response.ok) continue;

            const data = await response.json();

            for (const lineData of data) {

                const lineID = lineData.lineID;
                if (checkedLines.has(lineID)) continue;
                checkedLines.add(lineID);

                const lineName = linesData.find(l => l.lineID === lineID)?.name || lineID;

                for (const entry of lineData.timetable) {

                    const vehicleID = entry.vehicleID;

                    if (!vehiclesMap.has(vehicleID)) {

                        const vehicleFromJson = vehiclesData.find(v => v.vehicleID === vehicleID);
                        const sideNo = vehicleFromJson?.sideNo || 'Nieznany';
                        const model = getModelBySideNo(sideNo) || 'Nieznany model';

                        vehiclesMap.set(vehicleID, {
                            vehicleID,
                            sideNo,
                            model,
                            lines: new Set([lineName])
                        });

                    } else {
                        vehiclesMap.get(vehicleID).lines.add(lineName);
                    }
                }
            }
        }

        const result = Array.from(vehiclesMap.values()).map(v => ({
            vehicleID: v.vehicleID,
            sideNo: v.sideNo,
            model: v.model,
            lines: Array.from(v.lines)
        }));

        if (result.length === 0) {
            return res.status(400).json({ error: "Brak danych — zapis anulowany." });
        }

        const history = await loadHistory();

        // 🔥 USUWAMY CAŁY DZIEŃ PRZED NOWYM ZAPISEM
        for (const sideNo in history) {
            if (history[sideNo][dateKey]) {
                delete history[sideNo][dateKey];
            }
        }

        // 🔁 zapisujemy dzień od nowa
        for (const v of result) {
            if (!history[v.sideNo]) history[v.sideNo] = {};
            history[v.sideNo][dateKey] = v.lines;
        }

        await saveHistory(history);

        res.json({
            date: dateKey,
            totalVehicles: result.length,
            vehicles: result
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Błąd podczas zbierania danych");
    }
};