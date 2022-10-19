const socket = io.connect();
const { normalize, schema, denormalize } = require("normalizr");
const fs = require("fs");

const nombre = document.getElementById("nombre");
const precio = document.getElementById("precio");
const foto = document.getElementById("foto");
const enviarProducto = document.getElementById("enviarProducto");

const agregarProducto = document.getElementById("agregarProducto");
agregarProducto.addEventListener("submit", (e) => {
  e.preventDefault();
  const producto = {
    title: agregarProducto[0].value,
    price: agregarProducto[1].value,
    thumbnail: agregarProducto[2].value,
  };
  socket.emit("update", producto);
  agregarProducto.reset();
});

socket.on("productos", (productos) => {
  makeHtmlTable(productos).then((html) => {
    document.getElementById("productos").innerHTML = html;
  });
});

function makeHtmlTable(productos) {
  return productos
    .map((producto) => {
      return `
    <h2>Lista de productos</h2>
  <div>
    <table>
      <tr>
        <th>Nombre</th>
        <th>Precio</th>
        <th>Foto</th>
      </tr>
      <tr>
        <td>${producto.title}</td>
        <td>${producto.price}</td>
        <td><img width="50" src=${producto.thumbnail} alt="not found"</td>
      </tr>
    </table>
  </div> 
    `;
    })
    .join(" ");
}

nombre.addEventListener("input", () => {
  const elNombre = nombre.value.length;
  enviarProducto.disabled = !elNombre;
});

precio.addEventListener("input", () => {
  const elPrecio = precio.value.length;
  enviarProducto.disabled = !elPrecio;
});

foto.addEventListener("input", () => {
  const laFoto = foto.value.length;
  enviarProducto.disabled = !laFoto;
});

const userId = document.getElementById("userId");
const inputMensaje = document.getElementById("inputMensaje");
const enviar = document.getElementById("enviar");
const userNombre = document.getElementById("userNombre");
const userApellido = document.getElementById("userApellido");
const userEdad = document.getElementById("userEdad");
const userAlias = document.getElementById("userAlias");
const userAvatar = document.getElementById("userAvatar");

const publicarMensaje = document.getElementById("publicarMensaje");
publicarMensaje.addEventListener("submit", (e) => {
  e.preventDefault();

  const mensaje = {
    autor: [
      userId.value,
      userNombre.value,
      userApellido.value,
      userEdad.value,
      userAlias.value,
      userAvatar.value,
    ],
    texto: inputMensaje.value,
  };
  socket.emit("nuevoMensaje", mensaje);
  publicarMensaje.reset();
  inputMensaje.focus();
});

socket.on("mensajes", (mensajes) => {
  console.log(mensajes);
  const html = makeHtmlList(mensajes);
  document.getElementById("mensajes").innerHTML = html;
});

const mensajesNormalized = JSON.parse(fs.readFileSync("mensajes"));

const elMensaje = new schema.Entity("elMensaje");

const orden = new schema.Entity("orden", {
  id: elMensaje,
  nombre: elMensaje,
  apellido: elMensaje,
  edad: elMensaje,
  alias: elMensaje,
  avatar: elMensaje,
  texto: [elMensaje],
});

const grupo = new schema.Entity("orden", {
  elMensaje: [orden],
});

const util = require("util");

function print(objeto) {
  console.log(util.inspect(objeto, false, 12, true));
}

console.log("-------objeto normalizado-------");
const normalizedMensaje = normalize(mensajesNormalized, grupo);
print(normalizedMensaje);

const longO = JSON.stringify(mensajesNormalized).length;
console.log("longitud objeto original: ", longO);

const longN = JSON.stringify(normalizedMensaje).length;
console.log("longitud de objeto normalizado: ", longN);

const porcentajeC = (longN * 100) / longO;
console.log("porcentaje de compresión: ", porcentajeC.toFixed(2) + "%");

function makeHtmlList(mensajes) {
  return mensajes
    .map((mensaje) => {
      return `
      <div>
        <b style="color:blue;">${mensaje.autor}</b>
        [<span style="color:red;">${mensaje.fyh}</span>] :
        <i style="color:gray;">${mensaje.texto}</i>
      </div>  
      `;
    })
    .join(" ");
}

userName.addEventListener("input", () => {
  const elEmail = userName.value.length;
  const elTexto = inputMensaje.value.length;
  inputMensaje.disabled = !elEmail;
  enviar.disabled = !elEmail || !elTexto;
});

inputMensaje.addEventListener("input", () => {
  const elTexto = inputMensaje.value.length;
  enviar.disabled = !elTexto;
});
