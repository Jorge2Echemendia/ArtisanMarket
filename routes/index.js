// routes/index.js
const express = require("express");
const router = express.Router();
const products = require("../data/products");

router.get("/", (req, res) => {
  res.render("index", {
    title: "ArtisanMarket — Hecho a mano, hecho con alma",
    destacados: products.slice(0, 3),
  });
});

router.get("/about", (req, res) => {
  res.render("about", { title: "Sobre nosotros — ArtisanMarket" });
});

router.get("/contact", (req, res) => {
  res.render("contact", {
    title: "Contacto — ArtisanMarket",
    success: false,
    errors: [],
    form: {},
    submittedName: null,
  });
});

router.post("/contact", (req, res) => {
  const { nombre, email, asunto, mensaje, terminos } = req.body;
  const errors = [];

  const nombreTrim = (nombre || "").trim();
  if (!nombreTrim) {
    errors.push("El nombre es obligatorio.");
  } else if (nombreTrim.length < 2) {
    errors.push("El nombre debe tener al menos 2 caracteres.");
  } else if (nombreTrim.length > 80) {
    errors.push("El nombre no puede superar los 80 caracteres.");
  }

  const emailTrim = (email || "").trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailTrim) {
    errors.push("El email es obligatorio.");
  } else if (!emailRegex.test(emailTrim)) {
    errors.push("El email no tiene un formato válido.");
  }

  const asuntosValidos = ["encargo", "artesano", "pedido", "prensa", "otro"];
  if (!asunto) {
    errors.push("Debes seleccionar un asunto.");
  } else if (!asuntosValidos.includes(asunto)) {
    errors.push("El asunto seleccionado no es válido.");
  }

  const mensajeTrim = (mensaje || "").trim();
  if (!mensajeTrim) {
    errors.push("El mensaje no puede estar vacío.");
  } else if (mensajeTrim.length < 10) {
    errors.push("El mensaje debe tener al menos 10 caracteres.");
  } else if (mensajeTrim.length > 2000) {
    errors.push("El mensaje no puede superar los 2000 caracteres.");
  }

  if (!terminos) {
    errors.push("Debes aceptar la política de privacidad.");
  }

  if (errors.length > 0) {
    return res.status(400).render("contact", {
      title: "Contacto — ArtisanMarket",
      success: false,
      errors,
      form: {
        nombre: nombreTrim,
        email: emailTrim,
        asunto,
        mensaje: mensajeTrim,
        terminos,
      },
      submittedName: null,
    });
  }

  console.log("📩 Nuevo mensaje de contacto:", {
    nombre: nombreTrim,
    email: emailTrim,
    asunto,
    mensaje: mensajeTrim.slice(0, 120) + (mensajeTrim.length > 120 ? "…" : ""),
    fecha: new Date().toISOString(),
  });

  res.render("contact", {
    title: "Contacto — ArtisanMarket",
    success: true,
    errors: [],
    form: {},
    submittedName: nombreTrim.split(" ")[0],
  });
});

router.get("/cart", (req, res) => {
  res.render("cart", { title: "Carrito — ArtisanMarket" });
});

module.exports = router;
