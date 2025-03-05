const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

// Inicializar Firebase Admin
admin.initializeApp();

const app = express();
app.use(cors({ origin: true })); // Permitir CORS

// Ruta de prueba
app.get("/", (req, res) => {
    res.json({ message: "API funcionando con Express.js y Firebase Functions 🚀" });
});

// Ruta para autenticación (ejemplo)
app.post("/auth", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await admin.auth().getUserByEmail(email);
        res.json({ success: true, user });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Exponer la API como una Firebase Function
exports.api = functions.https.onRequest(app);
