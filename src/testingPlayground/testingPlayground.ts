import FrontEndDB from '../db/FrontEndDB/FrontEndDB'

/*******************
 * Testing playground put code here and check the console to see the results
 * ****************
 * */
import initSqlJs from 'sql.js'
export default (async function () {
  const config = {
    locateFile: (filename) => {
      return `./${filename}`
    },
  }

  const db = new FrontEndDB()
  const fedb = await db.getDatabase(config)
  console.log(fedb)
  console.log(db.DocTableDao)
  // The `initSqlJs` function is globally provided by all of the main dist files if loaded in the browser.
  // We must specify this locateFile function if we are loading a wasm file from anywhere other than the current html page's folder.
  // initSqlJs(config).then(function (SQL) {
  //   debugger
  //   //Create the database
  //   var db = new SQL.Database()
  //   // Run a query without reading the results
  //   db.run('CREATE TABLE test (col1, col2);')
  //   // Insert two rows: (1,111) and (2,222)
  //   db.run('INSERT INTO test VALUES (?,?), (?,?)', [1, 111, 2, 222])

  //   // Prepare a statement
  //   var stmt = db.prepare(
  //     'SELECT * FROM test WHERE col1 BETWEEN $start AND $end'
  //   )
  //   stmt.getAsObject({ $start: 1, $end: 1 }) // {col1:1, col2:111}

  //   // Bind new values
  //   stmt.bind({ $start: 1, $end: 2 })
  //   while (stmt.step()) {
  //     //
  //     var row = stmt.getAsObject()
  //     console.log('Here is a row: ' + JSON.stringify(row))
  //   }
  // })
})()
