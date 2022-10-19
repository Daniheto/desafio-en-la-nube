const knex = require("knex");
const { configMySQL, configSQLite } = require("./src/config.js");

(async () => {
  try {
    const dbCliente = knex(configMySQL.config);
    await dbCliente.schema.dropTableIfExists(configMySQL.tabla);

    await dbCliente.schema.createTable(configMySQL.tabla, (tabla) => {
      tabla.increments("id").primary();
      tabla.string("title");
      tabla.string("price");
      tabla.string("thumbnail");
    });
    await dbCliente.destroy();
    console.log("Se creo la tabla de productos");
  } catch (error) {
    console.log("error al crear la tabla de productos");
    console.log(error);
  }

  try {
    const dbCliente = knex(configSQLite.config);
    await dbCliente.schema.dropTableIfExists(configSQLite.tabla);

    await dbCliente.schema.createTable(configSQLite.tabla, (tabla) => {
      tabla.increments("id").primary();
      tabla.string("autor");
      tabla.string("texto");
      tabla.string("fyh");
    });
    await dbCliente.destroy();
    console.log("Se creo la tabla de mensajes");
  } catch (error) {
    console.log("error al crear la tabla de mensajes");
    console.log(error);
  }
})();
