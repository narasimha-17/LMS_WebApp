const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const controller = require("../controllers/roleModule.controller");

// All routes require JWT authentication
router.use(authMiddleware);

// Get all roles
router.get("/roles", controller.getRoles);

// Get all modules
router.get("/modules", controller.getModules);

// Search users (by name, email, id)
router.get("/users/search", controller.searchUsers);

// Get user role + module assignment data
router.get("/users/:userId/role-modules", controller.getUserRoleAndModules);

// Assign a role (includes assigning default modules)
router.post("/assign-role", controller.assignRole);

// Assign custom modules for custom_role
router.post("/assign-custom-modules", controller.assignCustomModules);

// Reset user to default role modules
router.post("/reset-default", controller.resetDefault);

module.exports = router;
