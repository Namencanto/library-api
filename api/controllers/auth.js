import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const validateCredentials = (login, name, password) => {
  // Basic Regex validation to check credentials
  const loginRegex = /^[a-zA-Z0-9]+$/;
  const nameRegex = /^[a-zA-Z\s]+$/;
  const passwordRegex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+~`|}{[\]:;?><,./-]).{8,}$/;

  if (!login) return "Login is required";
  if (!name) return "Name is required";
  if (!password) return "Password is required";

  // Check if credentials are valid
  if (!loginRegex.test(login))
    return "Login must consist only of lowercase letters, uppercase letters and numbers";
  if (!nameRegex.test(name))
    return "Name must consist of uppercase and lowercase letters only";
  if (!passwordRegex.test(password))
    return "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character";

  return null;
};

export const registerUser = (req, res) => {
  // SET AS VARIABLE OTHER CREDENTIALS
  const { login, name, password } = req.body;

  // Validate credentials function
  const validationError = validateCredentials(login, name, password);
  if (validationError) {
    return res.status(400).json(validationError);
  }

  // CHECK EXISTING USER
  const q = "SELECT * FROM users WHERE login = ?";

  db.query(q, [login, name], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists!");

    // Hash the password and create a user
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const q =
      "INSERT INTO users(`name`,`login`,`password`, `admin`) VALUES (?,?,?,0)";
    const values = [name, login, hash];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(201).json({
        message: "User successfully registered",
        user: {
          id: data.insertId,
          name,
          admin: false,
        },
      });
    });
  });
};

export const registerAdmin = (req, res) => {
  const { login, name, password } = req.body;

  // Validate credentials function
  const validationError = validateCredentials(login, name, password);
  if (validationError) {
    return res.status(400).json(validationError);
  }

  // Check if admin already exists
  const qCheckAdmin = "SELECT * FROM users WHERE login = ?";
  db.query(qCheckAdmin, [login], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists!");

    // Hash the password and create an admin
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const qCreateAdmin =
      "INSERT INTO users(`name`,`login`,`password`, `admin`) VALUES (?,?,?,1)";

    db.query(qCreateAdmin, [name, login, hash], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(201).json({
        message: "Admin successfully registered",
        user: {
          id: data.insertId,
          name,
          admin: true,
        },
      });
    });
  });
};

export const loginUser = (req, res) => {
  const { login, password } = req.body;

  // CHECK USER
  const q = "SELECT * FROM users WHERE login = ? AND admin = 0";

  db.query(q, [login], (err, data) => {
    const user = data[0];

    if (err) return res.status(500).json(err);
    if (data.length === 0)
      return res.status(401).json("Wrong login or password!");

    // Check password
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    if (!isPasswordCorrect)
      return res.status(401).json("Wrong login or password!");

    // JWT
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        admin: user.admin,
      },
      process.env.JWT_SECRET
    );
    res
      .cookie("jwt", token, {
        httpOnly: true,
      })
      .status(200)
      .json({
        message: "Successfully logged in",
        user: {
          id: user.id,
          name: user.name,
          admin: user.admin,
        },
      });
  });
};

export const loginAdmin = (req, res) => {
  const { login, password } = req.body;

  // CHECK USER
  const q = "SELECT * FROM users WHERE login = ? AND admin = 1";

  db.query(q, [login], (err, data) => {
    const user = data[0];

    if (err) return res.status(500).json(err);
    if (data.length === 0)
      return res.status(401).json("Wrong login or password!");

    // Check password
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    if (!isPasswordCorrect)
      return res.status(401).json("Wrong login or password!");

    // JWT
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        admin: user.admin,
      },
      process.env.JWT_SECRET
    );
    res
      .cookie("jwt", token, {
        httpOnly: true,
      })
      .status(200)
      .json({
        message: "Successfully logged in",
        user: {
          id: user.id,
          name: user.name,
          admin: user.admin,
        },
      });
  });
};

export const logout = (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json("Logged out successfully.");
};
