const express = require("express");
const client = require("../database/db_unravel.js");

const router = express.Router();

//Route to get the users
router.get("/users", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM tb_users");
    res.json(result.rows);
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).json({ error: "Error executing query" });
  }
});

//Route to get users by ID
router.get("/users/:user_id", async (req, res) => {
  const user_id = parseInt(req.params.user_id);
  try {
    const result = await client.query(
      "SELECT * FROM tb_users WHERE user_id = $1",
      [user_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).json({ error: "Error executing query" });
  }
});

// Route to delete users by ID
router.delete("/users/:user_id", async (req, res) => {
  const user_id = parseInt(req.params.user_id);
  try {
    const result = await client.query(
      "DELETE FROM tb_users WHERE user_id = $1 RETURNING *",
      [user_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully", user: result.rows[0] });
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).json({ error: "Error executing query" });
  }
});

//Route to create a users
router.post("/users", async (req, res) => {
  const {
    user_name,
    user_lastname,
    user_email,
    user_phone,
    user_birthdate,
    user_type_id,
  } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO tb_users (
          user_name, user_lastname, user_email, user_phone,
          user_birthdate, user_type_id
        ) VALUES (
          $1, $2, $3, $4, $5, $6
        ) RETURNING *`,
      [
        user_name,
        user_lastname,
        user_email,
        user_phone,
        user_birthdate,
        user_type_id,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).json({ error: "Error executing query" });
  }
});

// Route to update a users
router.put("/users/:user_id", async (req, res) => {
  const user_id = parseInt(req.params.user_id);
  const {
    user_name,
    user_lastname,
    user_email,
    user_phone,
    user_birthdate,
    user_type_id,
  } = req.body;

  try {
    const result = await client.query(
      "UPDATE tb_users SET user_name = $1, user_lastname = $2, user_email = $3, user_phone = $4, user_birthdate = $5, user_type_id = $6 WHERE user_id = $7 RETURNING *",
      [
        user_name,
        user_lastname,
        user_email,
        user_phone,
        user_birthdate,
        user_type_id,
        user_id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating user", err.stack);
    res.status(500).json({ error: "Error executing query" });
  }
});

module.exports = router;
