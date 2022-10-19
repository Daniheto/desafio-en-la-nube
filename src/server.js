const express = require("express");
const faker = require("faker");
faker.locale = "es";
require("dotenv").config();
const { fork } = require("child_process");
const path = require("path");
const args = process.argv;
const cluster = require("cluster");
const compression = require("compression");
const logger = require("./logger.js");

const { Server: HttpServer } = require("http");
const { Server: Socket } = require("socket.io");

const contenedorDB = require("../contenedores/contenedorDB.js");
const { configMySQL, configSQLite } = require("./config.js");

// Session
const session = require("express-session");
const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");

const mongoStore = require("connect-mongo");
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };

// --- Register & Login ----- //

const usuarios = [];

passport.use(
  "register",
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    (req, email, password, done) => {
      const { acceso } = req.body;

      const usuario = usuarios.find((usuario) => usuario.email == email);
      if (usuario) {
        return done("Usuario ya registrado");
      }

      const user = {
        email,
        password,
        acceso,
      };
      usuarios.push(user);

      return done(null, user);
    }
  )
);

passport.use(
  "login",
  new LocalStrategy((email, password, done) => {
    const user = usuarios.find((usuario) => usuario.email == email);

    if (!user) {
      return done(null, false);
    }

    if (user.password != password) {
      return done(null, false);
    }

    return done(null, user);
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.username);
});

passport.deserializeUser(function (username, done) {
  const usuario = usuarios.find((usuario) => usuario.email == email);
  done(null, usuario);
});

// ------------- //

const app = express();
app.use(
  session({
    store: mongoStore.create({
      mongoUrl: "mongodb://localhost/sesiones",
      mongoOptions: advancedOptions,
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000,
    },
  })
);

const httpServer = new HttpServer(app);
const io = new Socket(httpServer);

const productosApi = new contenedorDB(configMySQL.config, configMySQL.tabla);
const mensajesApi = new contenedorDB(configSQLite.config, configSQLite.tabla);

app.use(passport.initialize());
app.use(passport.session());

io.on("connection", async (socket) => {
  console.log("nuevo cliente conectado");

  socket.emit("productos", await productosApi.listarALL());

  socket.on("update", (producto) => {
    productosApi.guardar(producto);
    io.sockets.emit("productos", productosApi.listarALL());
  });

  socket.emit("mensajes", await mensajesApi.listarALL());

  socket.on("nuevoMensaje", async (mensaje) => {
    mensaje.fyh = new Date().toLocaleString();
    await mensajesApi.guardar(mensaje);
    io.sockets.emit("mensajes", await mensajesApi.listarALL());
  });
});

// faker

let id = 1;
function getNextId() {
  return id++;
}

function crearCombinacionAlAzar(id) {
  return {
    id,
    nombre: faker.name.nombre(),
    apellido: faker.finance.precio(),
    color: faker.image.foto(),
  };
}

function generarProductos(cant) {
  const productosTest = [];
  for (let i = 0; i < cant; i++) {
    productosTest.push(crearCombinacionAlAzar(getNextId()));
  }
  return productosTest;
}

const CANT_PERS_DEFAULT = 5;

app.get("/productos-test", (req, res) => {
  const cant = Number(req.query.cant) || CANT_PERS_DEFAULT;
  res.json(generarProductos(cant));
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}

// Register & Login

app.get("/register", (req, res) => {
  res.redirect("/public/index.html");
});

app.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/failregister",
    successRedirect: "/",
  })
);

app.get("/failregister", (req, res) => {
  res.redirect("/public/index.html");
});

app.get("/login", (req, res) => {
  res.redirect("/public/index.html");
});

app.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/faillogin",
    successRedirect: "/datos",
  })
);

app.get("/faillogin", (req, res) => {
  res.redirect("/public/index.html");
});

// Logout

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.get("/", isAuth, (req, res) => {
  res.redirect("/public/index.html");
});

app.get("/", (req, res) => {
  res.send("Servidor express ok!");
});

app.post("/login", (req, res) => {
  let { nombre } = req.body;
  req.session.nombre = nombre;
  res.redirect("./main");
});

app.get("/main", (req, res) => {
  if (req.session.nombre) {
    logger.info(`Parametro usuario ${nombre} correcto para iniciar sesión`);
    res.send(`Bienvenido ${nombre}`);
  } else {
    logger.error("Parámetros incorrectos para iniciar sesión");
    res.send("No estas logueado");
    res.redirect("/login");
  }
});

app.get("/*", (req, res) => {
  const { url, method } = req;
  logger.warn(`Ruta ${method} ${url} no implementada`);
  res.send(`Ruta ${method} ${url} no está implementada`);
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (!err) res.send("Logout ok!");
    else res.send({ status: "Logout ERROR", body: err });
  });
});

// Process

const nombrePlataforma = process.platform;
const versionNode = process.version;
const memoriaReservada = process.memoryUsage();
const pid = process.pid;
const carpetaProyecto = process.cwd();

const info = {
  nombrePlataforma,
  versionNode,
  memoriaReservada,
  pid,
  carpetaProyecto,
};

app.get("/info-procesos", (req, res) => {
  res.send(info);
});
app.get("/info-procesos", compression(), (req, res) => {
  res.send(info);
});

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${server.address().port}`);
});

server.on("error", (error) => console.log(`Error en servidor ${error}`));
