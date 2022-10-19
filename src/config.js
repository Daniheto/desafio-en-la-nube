const configMySQL = {
  tabla: "productosMsql",
  config: {
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      port: 3306,
      user: "root",
      password: "",
      database: "ecomerce",
    },
  },
};

const configSQLite = {
  tabla: "mensajesSqLite",
  config: {
    client: "sqlite3",
    connection: {
      filename: `../DB/ecomerce.sqlite`,
    },
    useNullAsDefault: true,
  },
};

module.exports = { configMySQL, configSQLite };
