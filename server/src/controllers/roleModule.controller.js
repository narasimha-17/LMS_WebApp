const prisma = require("../prisma/client");


// ===============================
//  GET ROLES
// ===============================
exports.getRoles = async (req, res) => {
  try {
    const roles = await prisma.roles.findMany({
      orderBy: { role_name: "asc" },
    });
    return res.json({ success: true, roles });
  } catch (err) {
    console.error("GET ROLES ERROR:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ===============================
//  GET MODULES
// ===============================
exports.getModules = async (req, res) => {
  try {
    const modules = await prisma.modules.findMany({
      orderBy: { module_name: "asc" },
    });
    return res.json({ success: true, modules });
  } catch (err) {
    console.error("GET MODULES ERROR:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ===============================
//  SEARCH USERS
// ===============================
exports.searchUsers = async (req, res) => {
  const { term } = req.query;

  try {
    const users = await prisma.users.findMany({
      where: {
        OR: [
          { email: { contains: term, mode: "insensitive" } },
          { first_name: { contains: term, mode: "insensitive" } },
          { last_name: { contains: term, mode: "insensitive" } },
        ],
      },
      select: {
        user_id: true,
        first_name: true,
        last_name: true,
        email: true,
      },
      take: 30,
    });

    return res.json({ success: true, users });
  } catch (err) {
    console.error("SEARCH USERS ERROR:", err);
    return res.status(500).json({ success: false });
  }
};

// ===============================
//  GET USER ROLE + MODULES
// ===============================
exports.getUserRoleAndModules = async (req, res) => {
  const userId = Number(req.params.userId);

  try {
    // Get user-role-module mapping
    const mappings = await prisma.user_role_module.findMany({
      where: { user_id: userId },
      include: {
        role: true,
        module: true,
      },
    });

    if (mappings.length === 0) {
      return res.json({
        success: true,
        role: null,
        modules: [],
      });
    }

    return res.json({
      success: true,
      role: mappings[0].role,
      modules: mappings.map(m => m.module),
    });
  } catch (err) {
    console.error("GET USER ROLE MODULES ERROR:", err);
    return res.status(500).json({ success: false });
  }
};

// ===============================
//  ASSIGN ROLE (+ default modules)
// ===============================
exports.assignRole = async (req, res) => {
  const adminId = req.user.user_id;
  const { user_id, role_id } = req.body;

  try {
    // Remove existing role/modules
    await prisma.user_role_module.deleteMany({
      where: { user_id },
    });

    // Fetch default modules for the role
    const defaults = await prisma.role_module_default.findMany({
      where: { role_id },
    });

    // Insert default modules
    const entries = defaults.map(d => ({
      user_id,
      role_id,
      module_id: d.module_id,
      can_access: d.can_access,
      created_by: adminId,
    }));

    await prisma.user_role_module.createMany({ data: entries });

    return res.json({ success: true, message: "Role assigned successfully" });
  } catch (err) {
    console.error("ASSIGN ROLE ERROR:", err);
    return res.status(500).json({ success: false });
  }
};

// ===============================
//  ASSIGN CUSTOM MODULES
// ===============================
exports.assignCustomModules = async (req, res) => {
  const adminId = req.user.user_id;
  const { user_id, role_id, module_ids } = req.body;

  try {
    await prisma.user_role_module.deleteMany({
      where: { user_id },
    });

    // Insert selected modules
    const entries = module_ids.map(moduleId => ({
      user_id,
      role_id,
      module_id: moduleId,
      can_access: true,
      created_by: adminId,
    }));

    await prisma.user_role_module.createMany({ data: entries });

    return res.json({ success: true, message: "Custom role updated" });
  } catch (err) {
    console.error("ASSIGN CUSTOM ERROR:", err);
    return res.status(500).json({ success: false });
  }
};

// ===============================
//  RESET DEFAULT
// ===============================
exports.resetDefault = async (req, res) => {
  const adminId = req.user.user_id;
  const { user_id, role_id } = req.body;

  try {
    await prisma.user_role_module.deleteMany({
      where: { user_id },
    });

    const defaults = await prisma.role_module_default.findMany({
      where: { role_id },
    });

    const entries = defaults.map(d => ({
      user_id,
      role_id,
      module_id: d.module_id,
      can_access: d.can_access,
      created_by: adminId,
    }));

    await prisma.user_role_module.createMany({ data: entries });

    return res.json({ success: true, message: "Reset to default applied" });
  } catch (err) {
    console.error("RESET DEFAULT ERROR:", err);
    return res.status(500).json({ success: false });
  }
};
