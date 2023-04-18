import express from "express";
import {
  registerUser,
  registerAdmin,
  loginAdmin,
  loginUser,
  logout,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/admin/register", registerAdmin);
router.post("/admin/login", loginAdmin);

router.post("/logout", logout);

export default router;
