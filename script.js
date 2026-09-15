const API_URL = "https://script.google.com/macros/s/AKfycbylRdglrA79bZa04CmZTN6iTVh8Z5mZ1AeR4G2k201stTCxcUfLefaYwVEVVKtC87I/exec";
let rejectChartInstance = null;
async function loadDashboard() {
  try {
    const response = await fetch(API_URL);
    const result = await response.json();

    console.log("DATA:", result.data);
    console.log("COLORS:", result.colors);
    
    createRejectChart(result.data, result.colors);
    // WARNA LABEL CHART MENGIKUTI DONUT
setChartLabelColor("reject-label", result.colors.chartReject);
setChartLabelColor("nett-label", result.colors.chartNett);

    // =========================
    // DATA SHEET
    // =========================

    const data = result.data;

    document.getElementById("chartReject").textContent = data[0][3];
    document.getElementById("chartNett").textContent = data[1][3];

    // Baris 5
    document.getElementById("grossAll").textContent = data[4][2];
    document.getElementById("tanggal").textContent = data[4][3];
    
    // Baris 6
    document.getElementById("nettAll").textContent = data[5][2];

    // Baris 7
    document.getElementById("targetAll").textContent = data[6][2];

    // Baris 8
    document.getElementById("rejectSc").textContent = data[7][2];

    // Baris 9
    document.getElementById("rejectPercentage").textContent = data[8][2];

    // Modul & Training
    document.getElementById("moduleGross").textContent = data[5][5];
    document.getElementById("trainingGross").textContent = data[5][6];

    document.getElementById("moduleNett").textContent = data[6][5];
    document.getElementById("trainingNett").textContent = data[6][6];

    document.getElementById("modulePercentage").textContent = data[7][5];
    document.getElementById("trainingPercentage").textContent = data[7][6];

    document.getElementById("weight").textContent = data[8][6];

    // Last Input
    document.getElementById("lastName").textContent = data[10][2];
    document.getElementById("lastId").textContent = data[11][2];
    document.getElementById("lastNett").textContent = data[11][4];
    document.getElementById("lastGross").textContent = data[11][5];
    document.getElementById("lastPercentage").textContent = data[11][6];


    // =========================
    // WARNA CONDITIONAL FORMATTING
    // =========================

    applyCellColor(
      "targetAll",
      result.colors.C7
    );

    applyCellColor(
      "rejectPercentage",
      result.colors.C9
    );

    applyCellColor(
      "lastPercentage",
      result.colors.G12
    );

    applyCellColor(
      "modulePercentage",
      result.colors.F8
    );

    applyCellColor(
      "trainingPercentage",
      result.colors.G8
    );

    applyCellColor(
      "weight",
      result.colors.G9
    );
    // WARNA TERAKHIR DI INPUT
applyCellColor("lastName", result.colors.C11);
applyCellColor("lastId", result.colors.C12);
applyCellColor("lastNett", result.colors.E12);
applyCellColor("lastGross", result.colors.F12);
applyCellColor("lastPercentage", result.colors.G12);

// FORMAT FONT & ALIGNMENT DARI GOOGLE SHEETS

applyCellFormat("targetAll", result.colors.C7);
applyCellFormat("rejectPercentage", result.colors.C9);

applyCellFormat("modulePercentage", result.colors.F8);
applyCellFormat("trainingPercentage", result.colors.G8);

applyCellFormat("weight", result.colors.G9);

applyCellFormat("lastName", result.colors.C11);
applyCellFormat("lastId", result.colors.C12);
applyCellFormat("lastNett", result.colors.E12);
applyCellFormat("lastGross", result.colors.F12);
applyCellFormat("lastPercentage", result.colors.G12);


  } catch (error) {
    console.error("Gagal mengambil data:", error);
  }
}


// =========================
// APPLY WARNA
// =========================

function applyCellColor(elementId, color) {
    const element = document.getElementById(elementId);

    if (!element || !color) return;

    element.style.setProperty(
        "background-color",
        color.background,
        "important"
    );

    element.style.setProperty(
        "color",
        color.fontColor,
        "important"
    );
}

// =========================
// FORMAT MENGIKUTI GOOGLE SHEETS
// =========================

function applyCellFormat(elementId, format) {
    const element = document.getElementById(elementId);

    if (!element || !format) return;

    if (format.fontFamily) {
        element.style.fontFamily = format.fontFamily;
    }


    if (format.fontWeight) {
        element.style.fontWeight = format.fontWeight;
    }

    if (format.fontStyle) {
        element.style.fontStyle = format.fontStyle;
    }

    if (format.horizontalAlignment) {
        let align = format.horizontalAlignment;

        if (align === "general-left") {
            align = "left";
        }

        if (align === "general") {
            align = "left";
        }

        element.style.textAlign = align;
    }

    if (format.verticalAlignment) {
        element.style.verticalAlign = format.verticalAlignment;
    }
}

function setChartLabelColor(className, color) {
    const label = document.querySelector("." + className);

    if (!label || !color) return;

    label.style.color = color;

    const line = label.querySelector(".leader-line");

    if (line) {
        line.style.backgroundColor = color;
    }

    const percentage = label.querySelector("span");

    if (percentage) {
        percentage.style.color = color;
    }
}
// =========================
// UPDATE OTOMATIS 15 DETIK
// =========================

loadDashboard();

setInterval(() => {
    loadDashboard();
}, 15000);

// =========================
// CHART REJECT
// =========================

function createRejectChart(data, colors) {

  const canvas = document.getElementById("rejectChart");

  if (!canvas) return;

  const rejectText = data[0][3] || "0%";
const nettText = data[1][3] || "0%";

  const reject = Number(
  rejectText.replace("%", "").replace(",", ".").trim()
);

const nett = Number(
  nettText.replace("%", "").replace(",", ".").trim()
);

console.log("REJECT ANGKA:", reject);
console.log("NETT ANGKA:", nett);

if (rejectChartInstance) {
  rejectChartInstance.destroy();
}

  rejectChartInstance = new Chart(canvas, {
    type: "doughnut",

    data: {
      labels: ["REJECT", "NETT"],

      datasets: [{
        data: [reject, nett],

        backgroundColor: [
  colors.chartReject,
  colors.chartNett
],

        borderWidth: 0
      }]
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      cutout: "55%",

      plugins: {
        legend: {
          display: false
        },

        tooltip: {
          enabled: true,

          callbacks: {
            label: function(context) {
              return context.label + ": " +
                context.raw.toFixed(1) + "%";
            }
          }
        }
      }
    }
  });
}

// =========================
// JAM DIGITAL WIB
// =========================

function updateDigitalClock() {

    const clock = document.getElementById("digitalClock");

    if (!clock) return;

    const now = new Date();

    const time = now.toLocaleTimeString("id-ID", {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });

    clock.textContent = time;
}

// Jalankan langsung
updateDigitalClock();

// Update setiap 1 detik
setInterval(updateDigitalClock, 1000);
