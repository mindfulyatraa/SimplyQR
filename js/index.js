
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

// --- NEW ELEMENTS FOR TEMPLATES & CROP ---
const tabStandard = document.getElementById("tab-standard");
const tabTemplates = document.getElementById("tab-templates");
const contentStandard = document.getElementById("content-standard");
const contentTemplates = document.getElementById("content-templates");
const templateGrid = document.getElementById("template-grid");
const templateInputs = document.getElementById("template-inputs");
const templateCanvas = document.getElementById("template-canvas");
const btnDownloadTemplate = document.getElementById("btn-download-template");

// Crop Modal Elements
const cropModal = document.getElementById("crop-modal");
const cropImage = document.getElementById("crop-image");
const btnApplyCrop = document.getElementById("btn-apply-crop");
const removeBgCheck = document.getElementById("remove-bg-check");
let cropper = null;

// State
let currentMode = "standard"; // 'standard' | 'template'
let currentQRType = "url"; // 'url', 'text', 'wifi', 'vcard', ...
let selectedTemplate = null;
let templateUserTexts = {};

// 1. INITIALIZATION
qrPreview.innerHTML = "";
qrCode.append(qrPreview);


// 2. DATA GENERATORS (Static QR Logic)

function getQRData() {
    switch (currentQRType) {
        case 'url':
            return document.getElementById('input-url').value || "https://www.your-website.com";
        case 'menu':
            const menuInput = document.getElementById('input-menu-url');
            return menuInput ? (menuInput.value || "https://www.your-restaurant.com/menu") : "https://www.your-restaurant.com/menu";
        case 'text':
            return document.getElementById('input-text').value || "Your Text Here";
        case 'wifi':
            const ssid = document.getElementById('wifi-ssid').value;
            const pass = document.getElementById('wifi-password').value;
            const type = document.getElementById('wifi-type').value;
            const hidden = document.getElementById('wifi-hidden').checked;
            if (!ssid) return "WIFI:S:MyNetwork;T:WPA;P:MyPassword;;";
            return `WIFI:S:${ssid};T:${type};P:${pass};H:${hidden};;`;
        case 'vcard':
            const fname = document.getElementById('vcard-fname').value;
            const lname = document.getElementById('vcard-lname').value;
            const phone = document.getElementById('vcard-phone').value;
            const email = document.getElementById('vcard-email').value;
            const org = document.getElementById('vcard-org').value;
            const title = document.getElementById('vcard-title').value;
            const url = document.getElementById('vcard-website').value;
            // Basic vCard 3.0
            return `BEGIN:VCARD\nVERSION:3.0\nN:${lname};${fname};;;\nFN:${fname} ${lname}\nORG:${org}\nTITLE:${title}\nTEL:${phone}\nEMAIL:${email}\nURL:${url}\nEND:VCARD`;
        case 'whatsapp':
            const code = document.getElementById('wa-code').value;
            let num = document.getElementById('wa-phone').value;
            const msg = document.getElementById('wa-msg').value;
            if (!num) return "https://wa.me/";
            // Remove non-numeric chars for valid link
            num = num.replace(/\D/g, '');
            // Append code if not present (simple check)
            const cleanCode = code.replace(/\D/g, '');
            const fullNum = cleanCode + num;
            const encodedMsg = encodeURIComponent(msg);
            return `https://wa.me/${fullNum}?text=${encodedMsg}`;
        case 'upi':
            const upiId = document.getElementById('upi-id').value;
            const upiName = document.getElementById('upi-name').value;
            const upiAmt = document.getElementById('upi-amount').value;
            const upiNote = document.getElementById('upi-note').value;
            if (!upiId) return "upi://pay";
            let upiStr = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}`;
            if (upiAmt) upiStr += `&am=${upiAmt}`;
            if (upiNote) upiStr += `&tn=${encodeURIComponent(upiNote)}`;
            return upiStr;
        case 'email':
            const mailTo = document.getElementById('email-addr').value;
            const sub = document.getElementById('email-sub').value;
            const body = document.getElementById('email-body').value;
            return `mailto:${mailTo}?subject=${encodeURIComponent(sub)}&body=${encodeURIComponent(body)}`;
        case 'sms':
            const smsPhone = document.getElementById('sms-phone').value;
            const smsMsg = document.getElementById('sms-msg').value;
            return `SMSTO:${smsPhone}:${smsMsg}`;
        case 'event':
            // VEVENT format
            const evTitle = document.getElementById('event-title').value || "Event";
            const evLoc = document.getElementById('event-location').value;
            const evStart = document.getElementById('event-start').value; // ISO format
            const evEnd = document.getElementById('event-end').value;

            // Simple formatter to YYYYMMDDTHHMMSS
            const formatDate = (iso) => {
                if (!iso) return "";
                return iso.replace(/[-:]/g, "").replace(/\.\d{3}/, ""); // very basic cleanup
            };

            return `BEGIN:VEVENT\nSUMMARY:${evTitle}\nLOCATION:${evLoc}\nDTSTART:${formatDate(evStart)}\nDTEND:${formatDate(evEnd)}\nEND:VEVENT`;

        default:
            return "https://www.your-website.com";
    }
}

// 3. HELPER FUNCTIONS

const getOptions = () => {
    return {
        data: getQRData(),
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

const updateQRCode = async () => {
    const options = getOptions();
    qrCode.update(options);

    if (currentMode === "template" && selectedTemplate) {
        // Render Template
        const blob = await qrCode.getRawData("png");
        const qrUrl = URL.createObjectURL(blob);
        await CanvasUtils.renderTemplate(templateCanvas, selectedTemplate, qrUrl, templateUserTexts);
    }
};

// 4. EVENT LISTENERS

// Text Inputs - Add listeners to ALL input fields in the new forms
// Simple approach: select all .qr-input class elements
const allInputs = document.querySelectorAll('.qr-input');
let debounceTimer;

allInputs.forEach(input => {
    input.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(updateQRCode, 300);
    });
});

// Instant updates (Colors, etc)
[dotsColor, bgColor, dotsStyle, cornersStyle, logoMargin, errorCorrection].forEach(el => {
    if (el) {
        el.addEventListener("input", updateQRCode);
        el.addEventListener("change", updateQRCode);
    }
});

// LOGO UPLOAD & CROP Logic
if (logoFile) {
    logoFile.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                openCropModal(event.target.result);
                logoFile.value = "";
            };
            reader.readAsDataURL(file);
        }
    });
}

function openCropModal(imageSrc) {
    cropImage.src = imageSrc;
    cropModal.classList.remove("hidden");
    if (cropper) cropper.destroy();

    cropper = new Cropper(cropImage, {
        aspectRatio: NaN,
        viewMode: 1,
        autoCropArea: 0.8,
    });
}

window.closeCropModal = function () {
    cropModal.classList.add("hidden");
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
};

btnApplyCrop.addEventListener("click", () => {
    if (!cropper) return;
    const canvas = cropper.getCroppedCanvas();
    if (!canvas) return;

    // Transparent BG Check
    if (removeBgCheck.checked) {
        const ctx = canvas.getContext("2d");
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            // If white (tolerance)
            if (r > 240 && g > 240 && b > 240) {
                data[i + 3] = 0;
            }
        }
        ctx.putImageData(imgData, 0, 0);
    }

    const finalImage = canvas.toDataURL("image/png");
    qrCode.update({ image: finalImage });
    closeCropModal();
});


// 5. TABS & TEMPLATE LOGIC
function switchTab(mode) {
    currentMode = mode;
    if (mode === 'standard') {
        tabStandard.classList.add("border-primary", "text-primary", "bg-white", "dark:bg-gray-800");
        tabStandard.classList.remove("border-transparent", "text-slate-500", "bg-slate-50");

        tabTemplates.classList.remove("border-primary", "text-primary", "bg-white", "dark:bg-gray-800");
        tabTemplates.classList.add("border-transparent", "text-slate-500", "bg-slate-50");

        contentStandard.classList.remove("hidden");
        contentStandard.classList.add("flex");
        contentTemplates.classList.add("hidden");
        contentTemplates.classList.remove("flex");

    } else {
        tabTemplates.classList.add("border-primary", "text-primary", "bg-white", "dark:bg-gray-800");
        tabTemplates.classList.remove("border-transparent", "text-slate-500", "bg-slate-50");

        tabStandard.classList.remove("border-primary", "text-primary", "bg-white", "dark:bg-gray-800");
        tabStandard.classList.add("border-transparent", "text-slate-500", "bg-slate-50");

        contentTemplates.classList.remove("hidden");
        contentTemplates.classList.add("flex");
        contentStandard.classList.add("hidden");
        contentStandard.classList.remove("flex");

        if (!selectedTemplate && window.TEMPLATES.length > 0) {
            selectTemplate(0);
        } else {
            updateQRCode();
        }
    }
}

tabStandard.addEventListener("click", () => switchTab('standard'));
tabTemplates.addEventListener("click", () => switchTab('template'));


// 6. QR TYPE SWITCHER LOGIC
window.switchQRType = function (type) {
    currentQRType = type;

    // Hide all forms
    document.querySelectorAll('.input-form').forEach(el => el.classList.add('hidden'));

    // Show selected form
    const activeForm = document.getElementById(`form-${type}`);
    if (activeForm) activeForm.classList.remove('hidden');

    // Update Button Styles
    const buttons = document.querySelectorAll("[id^='btn-type-']");
    buttons.forEach(btn => {
        if (btn.id === `btn-type-${type}`) {
            btn.classList.add("border-primary", "text-primary", "bg-white", "dark:bg-[#1a202c]");
            btn.classList.remove("border-transparent", "text-slate-500", "hover:bg-slate-100");
        } else {
            btn.classList.remove("border-primary", "text-primary", "bg-white", "dark:bg-[#1a202c]");
            btn.classList.add("border-transparent", "text-slate-500", "hover:bg-slate-100");
        }
    });

    updateQRCode();
};

// Initialize Template Grid
if (window.TEMPLATES && templateGrid) {
    window.TEMPLATES.forEach((tmpl, index) => {
        const div = document.createElement("div");
        div.className = "cursor-pointer border border-slate-200 dark:border-gray-700 rounded-lg p-2 hover:border-primary transition-colors flex flex-col items-center gap-2";
        div.onclick = () => selectTemplate(index);

        const previewBox = document.createElement("div");
        previewBox.className = "w-full h-24 bg-slate-100 dark:bg-gray-800 rounded relative overflow-hidden";
        if (tmpl.background.startsWith("#")) {
            previewBox.style.backgroundColor = tmpl.background;
        } else {
            previewBox.style.backgroundImage = `url(${tmpl.background})`;
            previewBox.style.backgroundSize = "cover";
        }

        const label = document.createElement("span");
        label.className = "text-xs font-semibold text-slate-700 dark:text-gray-300";
        label.innerText = tmpl.name;

        div.appendChild(previewBox);
        div.appendChild(label);
        templateGrid.appendChild(div);
    });
}

function selectTemplate(index) {
    selectedTemplate = window.TEMPLATES[index];
    templateUserTexts = {};

    templateInputs.innerHTML = "";
    selectedTemplate.texts.forEach(field => {
        const div = document.createElement("div");
        const label = document.createElement("label");
        label.className = "block text-xs font-semibold text-slate-500 mb-1 capitalize";
        label.innerText = field.id;

        const input = document.createElement("input");
        input.type = "text";
        input.className = "w-full rounded-lg border-slate-300 dark:border-gray-600 text-sm px-3 py-2";
        input.value = field.default;
        input.oninput = (e) => {
            templateUserTexts[field.id] = e.target.value;
            updateQRCode();
        };

        div.appendChild(label);
        div.appendChild(input);
        templateInputs.appendChild(div);
    });

    updateQRCode();
}


// 7. DOWNLOAD HANDLERS
if (btnDownloadPng) {
    btnDownloadPng.addEventListener("click", () => qrCode.download({ name: "simplyqr-code", extension: "png" }));
}
if (btnDownloadSvg) {
    btnDownloadSvg.addEventListener("click", () => qrCode.download({ name: "simplyqr-code", extension: "svg" }));
}
if (btnDownloadPdf) {
    btnDownloadPdf.addEventListener("click", () => qrCode.download({ name: "simplyqr-code", extension: "pdf" }));
}

if (btnDownloadTemplate) {
    btnDownloadTemplate.addEventListener("click", () => {
        const link = document.createElement('a');
        link.download = `simplyqr-poster-${Date.now()}.png`;
        link.href = templateCanvas.toDataURL();
        link.click();
    });
}

// Global Toggle Function for Accordion
window.toggleSection = function (id) {
    if (section) {
        section.classList.toggle('hidden');
    }
};

// AI Input Mock Listener
const aiInput = document.getElementById("ai-input");
if (aiInput) {
    aiInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            // Mock AI response
            const term = aiInput.value.toLowerCase();
            if (term.includes("red")) {
                dotsColor.value = "#ef4444";
                bgColor.value = "#ffffff";
            } else if (term.includes("blue")) {
                dotsColor.value = "#3b82f6";
                bgColor.value = "#eff6ff";
            } else if (term.includes("coffee")) {
                dotsColor.value = "#78350f";
                bgColor.value = "#fffbeb";
                if (dotsStyle) dotsStyle.value = "classy";
            }
            updateQRCode();
            aiInput.value = "";
            alert("AI Design Applied: " + term);
        }
    });
}

// Templates Nav Link
const navTemplates = document.getElementById("nav-templates");
if (navTemplates) {
    navTemplates.addEventListener("click", (e) => {
        e.preventDefault();
        switchTab('template');
        // Scroll to editor if needed
        document.getElementById("generator-top").scrollIntoView({ behavior: "smooth" });
    });
}

// Initial Render
updateQRCode();