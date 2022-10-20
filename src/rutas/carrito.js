import { Router } from "express";

const carrito = [];

carrito.post("/", (req, res) => {
  for (let i = 0; i < carrito.length; i++) {
    const idCarrito = carrito[i];
    if ((elemnt.id = [])) element.id = idCarrito++;
  }
  carrito.push(req.body);
  res.json(carrito);
});

carrito.delete("/:id", (req, res) => {
  const id = req.params.id;
  carrito.filter((element, index) => {
    if (element.id == id) {
      carrito.splice(index, 1);
    }
  });
  res.json(carrito);
});

carrito.get("/:id/productos", (req, res) => {
  let id = req.params.id;
  let response = null;
  if (id) {
    carrito.filter((element) => {
      if (element.id == id) {
        response = element;
      }
    });
    return res.send(response);
  }
  return res.json(carrito);
});

carrito.post("/:id/productos", (req, res) => {
  carrito.push(req.body);
  res.json(carrito);
});

carrito.delete("/:id/productos/:id_prod", (req, res) => {
  const id = req.params.id;
  const id_prod = req.params.id_prod;
  carrito.filter((element, index) => {
    if (element.id == id && element.id_prod == id_prod) {
      productos.splice(index, 1);
    }
  });
  res.json(carrito);
});

export default carrito;
