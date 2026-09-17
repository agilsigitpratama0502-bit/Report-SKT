const API_URL = "https://script.google.com/macros/s/AKfycbyjMXggDjLc35K_24sDISS4oJaS7lP5vgzyDRRdGCliDbvWuCUu95acZvNvjvxIDVE/exec";


async function loadData() {

    const tableBody = document.getElementById("tableBody");
    const status = document.getElementById("status");

    tableBody.innerHTML = `
        <tr>
            <td colspan="7" class="loading">
                Memuat data...
            </td>
        </tr>
    `;

    status.textContent = "Mengambil data...";


    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("API tidak dapat diakses");
        }


        const result = await response.json();

        console.log("Data:", result);


        if (!result.success) {
            throw new Error(
                result.message || "Data gagal diambil"
            );
        }


        const data = result.data || [];
        const fontColors = result.fontColors || [];
        const backgrounds = result.backgrounds || [];


        if (data.length <= 1) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="loading">
                        Tidak ada data.
                    </td>
                </tr>
            `;

            status.textContent = "Tidak ada data";

            return;
        }


        tableBody.innerHTML = "";


        for (
            let rowIndex = 1;
            rowIndex < data.length;
            rowIndex++
        ) {

            const row = data[rowIndex];

            const tr = document.createElement("tr");


            for (
                let colIndex = 0;
                colIndex < 7;
                colIndex++
            ) {

                const td = document.createElement("td");

                const value = row[colIndex] || "";

                td.textContent = value;


                /*
                 * WARNA FONT DARI GOOGLE SHEETS
                 */

                if (
                    fontColors[rowIndex] &&
                    fontColors[rowIndex][colIndex]
                ) {

                    td.style.color =
                        fontColors[rowIndex][colIndex];

                }


                /*
                 * WARNA BACKGROUND DARI GOOGLE SHEETS
                 */

                if (
                    backgrounds[rowIndex] &&
                    backgrounds[rowIndex][colIndex]
                ) {

                    td.style.backgroundColor =
                        backgrounds[rowIndex][colIndex];

                }


                tr.appendChild(td);

            }


            tableBody.appendChild(tr);

        }


        const jumlahData = data.length - 1;

        status.textContent =
            `${jumlahData} data berhasil dimuat`;


    } catch (error) {

        console.error("Error:", error);


        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="loading">
                    Gagal mengambil data.
                </td>
            </tr>
        `;


        status.textContent = "Koneksi gagal";

    }

}


/* ================= JAM ================= */

function updateClock() {

    const now = new Date();


    const tanggal =
        now.toLocaleDateString(
            "id-ID",
            {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );


    const jam =
        now.toLocaleTimeString(
            "id-ID",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false
            }
        );


    document.getElementById("tanggal").textContent =
        tanggal;

    document.getElementById("jam").textContent =
        jam;

}


/* ================= START ================= */

updateClock();

setInterval(
    updateClock,
    1000
);


loadData();

setInterval(
    loadData,
    60000
);