
/**
 * CanvasUtils: Helper functions for composite image generation
 */

// Draw an image onto the context
function drawImage(ctx, src, x, y, w, h) {
    return new Promise((resolve, reject) => {
        if (!src) return resolve();
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            ctx.drawImage(img, x, y, w, h);
            resolve();
        };
        img.onerror = reject;
        img.src = src;
    });
}

// Draw text with wrapping
function drawText(ctx, text, x, y, fontSize, color, fontFamily = "Inter", align = "center", maxWidth = 600) {
    if (!text) return;
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = "middle";

    // Simple wrap or truncation could go here, for now just draw
    ctx.fillText(text, x, y);
}

// Draw the generated QR Blob onto the canvas
function drawQR(ctx, qrBlobUrl, x, y, size) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, x, y, size, size);
            resolve();
        };
        img.src = qrBlobUrl;
    });
}

// Main render function for a template
async function renderTemplate(canvas, template, qrUrl, userTexts = {}) {
    const ctx = canvas.getContext('2d');

    // 1. Set Dimensions
    canvas.width = template.width;
    canvas.height = template.height;

    // 2. Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 3. Draw Background
    // If it's a solid color
    if (template.background.startsWith('#')) {
        ctx.fillStyle = template.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        // Assume URL
        await drawImage(ctx, template.background, 0, 0, canvas.width, canvas.height);
    }

    // 4. Draw QR Code
    // We assume the QR is square
    await drawQR(ctx, qrUrl, template.qr.x, template.qr.y, template.qr.size);

    // 5. Draw User Texts (Dynamic) or Template Defaults
    template.texts.forEach(field => {
        const content = userTexts[field.id] || field.default;
        drawText(ctx, content, field.x, field.y, field.fontSize, field.color, field.fontFamily || "Inter", field.align);
    });
}

// Export functions globally
window.CanvasUtils = {
    renderTemplate
};
