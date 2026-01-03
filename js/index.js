
// Initialize QRCodeStyling instance
const qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    type: "svg", // Default to svg for better quality on screen
    data: "https://www.your-website.com",
    image: "",
    dotsOptions: {
        color: "#000000",
        type: "square"
    },
    backgroundOptions: {
        color: "#ffffff",
    },
    imageOptions: {
        crossOrigin: "anonymous",
        margin: 0
    }
});

// DOM Elements
const qrText = document.getElementById("qr-text");
const qrPreview = document.getElementById("qr-preview");

const btnDownloadPng = document.getElementById("btn-download-png");
const btnDownloadSvg = document.getElementById("btn-download-svg");
const btnDownloadPdf = document.getElementById("btn-download-pdf");

const dotsColor = document.getElementById("dots-color");
const bgColor = document.getElementById("bg-color");
const dotsStyle = document.getElementById("dots-style");
const cornersStyle = document.getElementById("corners-style");
const logoFile = document.getElementById("logo-file");
const logoMargin = document.getElementById("logo-margin");
const errorCorrection = document.getElementById("error-correction");

// Clear existing content (placeholder text)
qrPreview.innerHTML = "";
// Append the QR code to the preview container
qrCode.append(qrPreview);

// Helper to get current options
const getOptions = () => {
    return {
        data: qrText.value || "https://www.your-website.com",
        dotsOptions: {
            color: dotsColor.value,
            type: dotsStyle.value
        },
        backgroundOptions: {
            color: bgColor.value,
        },
        cornersSquareOptions: {
            type: cornersStyle.value
        },
        cornersDotOptions: {
            type: cornersStyle.value
        },
        qrOptions: {
            errorCorrectionLevel: errorCorrection.value
        },
        imageOptions: {
            margin: parseInt(logoMargin.value)
        }
    };
};

const updateQRCode = () => {
    qrCode.update(getOptions());
};

// Debounce for text input
let debounceTimer;
qrText.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        updateQRCode();
    }, 300);
});

// Event Listeners for instant updates
[dotsColor, bgColor, dotsStyle, cornersStyle, logoMargin, errorCorrection].forEach(el => {
    if (el) {
        el.addEventListener("input", updateQRCode);
        el.addEventListener("change", updateQRCode);
    }
});

// Logo Upload Logic
if (logoFile) {
    logoFile.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                qrCode.update({
                    image: event.target.result
                });
            };
            reader.readAsDataURL(file);
        } else {
            qrCode.update({
                image: ""
            });
        }
    });
}

// Download Handlers
if (btnDownloadPng) {
    btnDownloadPng.addEventListener("click", () => {
        qrCode.download({ name: "simplyqr-code", extension: "png" });
    });
}

if (btnDownloadSvg) {
    btnDownloadSvg.addEventListener("click", () => {
        qrCode.download({ name: "simplyqr-code", extension: "svg" });
    });
}

if (btnDownloadPdf) {
    btnDownloadPdf.addEventListener("click", () => {
        qrCode.download({ name: "simplyqr-code", extension: "pdf" });
    });
}

// Global Toggle Function for Accordion
window.toggleSection = function (id) {
    const section = document.getElementById(id);
    if (section) {
        // Toggle the 'hidden' class
        section.classList.toggle('hidden');

        // Rotate the expand icon if we want (optional, requires selecting the icon)
    }
};