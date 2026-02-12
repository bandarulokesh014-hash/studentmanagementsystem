const express = require('express');
const oracledb = require('oracledb');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const dbConfig = {
  user: "system",
  password: "your_password",
  connectString: "localhost:1521/XE"
};

app.post('/login', async (req, res) => {
  const { username, uid } = req.body;

  try {
    const connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT * FROM students WHERE username = :username AND uid = :uid`,
      [username, uid]
    );

    await connection.close();

    if (result.rows.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Invalid Username or UID" });
    }

  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Server Error" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
