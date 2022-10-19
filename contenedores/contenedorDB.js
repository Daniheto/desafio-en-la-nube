const knex = require("knex");

class contenedorDb {
  constructor(config, tabla) {
    this.knex = knex(config);
    this.tabla = tabla;
  }

  async listar(id) {
    try {
      return await this.knex.select().from(this.tabla).where("id", id);
    } catch (error) {
      throw new Error(`Error al listar: ${error}`);
    }
  }

  async listarALL() {
    try {
      return await this.knex.select().from(this.tabla);
    } catch (error) {
      throw new Error(`Error al listar: ${error}`);
    }
  }

  async guardar(obj) {
    try {
      return await this.knex(this.tabla).insert(obj);
    } catch (error) {
      throw new Error(`Error al guardar: ${error}`);
    }
  }

  async actualizar(elem, id) {
    try {
      return await this.knex(this.tabla).where("id", id).update(elem);
    } catch (error) {
      throw new Error(`Error al actualizar: ${error}`);
    }
  }

  async borrar(id) {
    try {
      return await this.knex(this.tabla).where("id", id).del();
    } catch (error) {
      throw new Error(`Error al borrar: ${error}`);
    }
  }

  async borrarAll() {
    try {
      return await this.knex(this.tabla).del();
    } catch (error) {
      throw new Error(`Error al borrar: ${error}`);
    }
  }
}

module.exports = contenedorDb;
