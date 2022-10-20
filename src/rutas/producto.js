import { Router } from "express";

const productos = [
  {
    nombre: "producto1",
    descripcion: "descripcion1",
    foto: "https://picsum.photos/200",
    precio: 2,
    codigo: 1,
    stock: 10,
    timestamp: 1,
    id: 1,
  },
  {
    nombre: "producto2",
    descripcion: "descripcion2",
    foto: "https://picsum.photos/200",
    precio: 2,
    codigo: 2,
    stock: 10,
    timestamp: 1,
    id: 2,
  },
];

productos.get("/visualizar/:id?", (req, res) => {
  let id = req.params.id;
  let response = null;
  if (id) {
    productos.filter((element) => {
      if (element.id == id) {
        response = element;
      }
    });
    return res.send(response);
  }
  return res.json(productos);
});

productos.post("/enviar", (req, res) => {
  productos.push(req.body);
  res.json(productos);
});

productos.put("/actualizar/:id", (req, res) => {
  const id = req.params.id;
  const body = req.body;
  productos.filter((element) => {
    if (element.id == id) {
      element.nombre = body.nombre;
      element.descripcion = body.descripcion;
      element.foto = body.foto;
      element.precio = body.precio;
      element.codigo = body.codigo;
      element.stock = body.stock;
      element.timestamp = body.timestamp;
    }
  });
  res.json(productos);
});

productos.delete("/borrar/:id", (req, res) => {
  const id = req.params.id;
  productos.filter((element, index) => {
    if (element.id == id) {
      productos.splice(index, 1);
    }
  });
  res.json(productos);
});

export default productos;
