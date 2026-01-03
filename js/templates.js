
/**
 * Templates Configuration
 * Defines the layout and default assets for different QR templates.
 * Coordinates are based on an internal standard (e.g., 800x1200 px).
 */

const TEMPLATES = [
    {
        id: "menu-classic",
        name: "Classic Menu",
        category: "Restaurant",
        width: 800,
        height: 1200,
        background: "https://images.unsplash.com/photo-1544025162-d76690b60943?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Placeholder Food Background
        qr: { x: 250, y: 400, size: 300 },
        texts: [
            { id: "title", default: "SCAN FOR MENU", x: 400, y: 250, fontSize: 64, color: "#FFFFFF", align: "center", type: "text" },
            { id: "subtitle", default: "Fresh & Delicious", x: 400, y: 320, fontSize: 32, color: "#DDDDDD", align: "center", type: "text" },
            { id: "footer", default: "www.restaurant.com", x: 400, y: 1100, fontSize: 24, color: "#FFFFFF", align: "center", type: "text" }
        ],
        overlayColor: "rgba(0,0,0,0.6)" // darken the background image if needed (logic to be added in render)
    },
    {
        id: "event-dark",
        name: "Night Event",
        category: "Events",
        width: 800,
        height: 1200,
        background: "#111111", // Solid Dark
        qr: { x: 200, y: 500, size: 400 },
        texts: [
            { id: "title", default: "VIP ACCESS", x: 400, y: 200, fontSize: 80, color: "#FFD700", align: "center", fontFamily: "serif" }, // Gold
            { id: "subtitle", default: "Scan to Register", x: 400, y: 400, fontSize: 36, color: "#FFFFFF", align: "center" },
            { id: "date", default: "AUG 24 • 10 PM", x: 400, y: 1000, fontSize: 40, color: "#FFFFFF", align: "center" }
        ]
    },
    {
        id: "promo-sale",
        name: "Summer Sale",
        category: "Retail",
        width: 800,
        height: 800, // Square
        background: "#ebf8ff", // Light Blue
        qr: { x: 250, y: 250, size: 300 },
        texts: [
            { id: "title", default: "SUMMER SALE", x: 400, y: 100, fontSize: 60, color: "#2b6cb0", align: "center" },
            { id: "offer", default: "Get 50% OFF", x: 400, y: 180, fontSize: 48, color: "#e53e3e", align: "center" },
            { id: "cta", default: "Scan to Shop", x: 400, y: 650, fontSize: 32, color: "#2d3748", align: "center" }
        ]
    }
];

window.TEMPLATES = TEMPLATES;
