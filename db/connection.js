const { mysqlPool, postgresPool } = require('./config');
const dbType = process.env.DB_TYPE;

const convertQuestionMarksToDollarSigns = (sql) => {
  let index = 0;
  return sql.replace(/\?/g, () => `$${++index}`);
};

const queryWrapper = async (client, sql, params) => {
  if (dbType === 'postgres') {
    sql = convertQuestionMarksToDollarSigns(sql);
  }
  const result = await client.query(sql, params);
  return result.rows ? result.rows : result[0];
};

const getConnection = async () => {
  if (dbType === 'mysql') {
    const connection = await mysqlPool.getConnection();
    return {
      query: (sql, params) => queryWrapper(connection, sql, params),
      release: () => connection.release(),
      format: (sql, params) => connection.format(sql, params)
    };
  } else if (dbType === 'postgres') {
    const client = await postgresPool.connect();
    return {
      query: (sql, params) => queryWrapper(client, sql, params),
      release: () => client.release(),
      format: (sql, params) => {
        return sql.replace(/\?/g, (_, i) => `$${params[i - 1]}`);
      }
    };
  } else {
    throw new Error('Tipo de base de datos no soportada');
  }
};

const getOrCreate = async (connection, table, data, uniqueField) => {
  try {
    const selectQuery = connection.format(`SELECT * FROM ${table} WHERE ${uniqueField} = ?`, [data[uniqueField]]);
    const rows = await connection.query(selectQuery);
    if (rows.length > 0) {
      return rows[0];
    }

    const insertQuery = connection.format(`INSERT INTO ${table} SET ?`, data);
    const result = await connection.query(insertQuery);
    data.id = result.insertId || result[0]?.id; // Manejo de IDs para MySQL y PostgreSQL

    const selectQuery2 = connection.format(`SELECT * FROM ${table} WHERE ${uniqueField} = ?`, [data[uniqueField]]);
    const rows2 = await connection.query(selectQuery2);
    if (rows2.length > 0) {
      return { ...data, ...rows2[0] };
    }

    return data;
  } catch (error) {
    console.error(`Error en getOrCreate para la tabla ${table} con el campo ${uniqueField}:`, error);
    throw error;
  }
};

module.exports = {
  getConnection,
  getOrCreate
};
