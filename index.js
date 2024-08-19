const express = require("express");
const oracledb = require("oracledb");
const app = express();
const port = 3000;
var password = "sdtvend";

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

// Initialize Oracle Client for Thick mode
try {
  oracledb.initOracleClient({ libDir: "C:\\oracle\\instantclient_23_4" }); // Adjust the path as necessary
} catch (err) {
  console.error("Failed to initialize Oracle Client:", err);
  process.exit(1);
}

async function selectAllEmployees(req, res) {
  try {
    const connection = await oracledb.getConnection({
      user: "sdtvend",
      password: password,
      connectString: "192.168.1.204:1521/sdtdb",
    });

    console.log("GET - /employees get all employee data");
    // run query to get all employees
    result = await connection.execute(`SELECT * FROM vdb_det`);
    return res.send(result);
  } catch (err) {
    //send error message
    return res.send(err.message);
  }
}

//get /employess
app.get("/employees", function (req, res) {
  selectAllEmployees(req, res);
});

async function selectEmployeesById(req, res, id) {
  try {
    connection = await oracledb.getConnection({
      user: "hr",
      password: password,
      connectString: "localhost:1521/xepdb1",
    });
    // run query to get employee with employee_id
    result = await connection.execute(
      `SELECT * FROM employees where employee_id=:id`,
      [id]
    );
  } catch (err) {
    //send error message
    return res.send(err.message);
  }
}

//get /employee?id=<id employee>
app.get("/employee", function (req, res) {
  //get query param ?id
  let id = req.query.id;
  // id param if it is number
  if (isNaN(id)) {
    res.send("Query param id is not number");
    return;
  }
  selectEmployeesById(req, res, id);
});

app.listen(port, () =>
  console.log("nodeOracleRestApi app listening on port %s!", port)
);
