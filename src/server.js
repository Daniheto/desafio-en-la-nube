import express from "express";

const app = express();

app.use(express.static("public"));

const productos = [];
const carrito = [];

app.use(express.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

const validar = (req, res, next) => {
  if (req.headers.admin === true) {
    next();
  } else {
    res.status(401).JSON({ error: -1, descripción: "Ruta no autorizada." });
  }
};

app.use(express.urlencoded({ extended: true }));

export default app;
