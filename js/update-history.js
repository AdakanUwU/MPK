app.get('/api/daily-vehicles/:year?/:month?/:day?', async (req, res) => {
    try {

        // ⬇️ Ładujemy wszystkie dane równolegle (bez zmiany logiki)
        await Promise.all([
            loadLinesData(),
            loadVehiclesData(),
            loadDatabaseData()
        ]);

        const busStops = [
            "d7e66f5d-f797-4b77-ae77-896382d11271",
            "3243c09c-07ec-4689-9ac4-9f84742a8129",
            "77f8fd2d-5438-4d4b-a456-5eedcf801fae",
            "b595724b-639a-4911-8d27-236df1d4b7b8",
            "ced57f35-b2cb-4ac4-8ea3-b1de51b81fbe",
            "c3019e37-a433-4b36-9b0c-b03dd430a7a3",
            "0fbb4646-f523-45cf-bb35-43b09d40a490"
        ];

        const { year, month, day } = req.params;

        let dateObj = (year && month && day)
            ? new Date(`${year}-${month}-${day}`)
            : new Date();

        const finalYear = dateObj.getFullYear();
        const finalMonth = String(dateObj.getMonth() + 1).padStart(2, '0');
        const finalDay = String(dateObj.getDate()).padStart(2, '0');
        const dateKey = `${finalYear}-${finalMonth}-${finalDay}`;

        const checkedLines = new Set();
        const vehiclesMap = new Map();

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

        // 🔥 Usuwamy dany dzień przed nowym zapisem
        for (const sideNo in history) {
            if (history[sideNo][dateKey]) {
                delete history[sideNo][dateKey];
            }
        }

        // 🔁 Zapisujemy dzień od nowa
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
});