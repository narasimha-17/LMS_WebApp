const prisma = require("../prisma/prismaClient");

// GET ALL MENUS
exports.getAll = async (req, res) => {
  try {
    const menus = await prisma.menus.findMany({
      orderBy: { display_order: "asc" },
      include: { submenus: true }
    });

    res.json({ success: true, data: menus });
  } catch (err) {
    console.error("❌ MENU FETCH ERROR:", err);
    res.status(500).json({ success: false, message: "Error fetching menus" });
  }
};

// CREATE MENU
exports.create = async (req, res) => {
  const { menu_name, menu_slug, display_order } = req.body;

  try {
    await prisma.menus.create({
      data: {
        menu_name,
        menu_slug,
        display_order: display_order ?? 0,
        is_active: true
      }
    });

    res.json({ success: true, message: "Menu added" });
  } catch (err) {
    console.error("❌ MENU CREATE ERROR:", err);
    res.status(500).json({ success: false, message: "Error creating menu" });
  }
};

// UPDATE MENU
exports.update = async (req, res) => {
  const id = Number(req.params.id);
  const { menu_name, menu_slug, display_order, is_active } = req.body;

  try {
    await prisma.menus.update({
      where: { menu_id: id },
      data: { menu_name, menu_slug, display_order, is_active }
    });

    res.json({ success: true, message: "Menu updated" });
  } catch (err) {
    console.error("❌ MENU UPDATE ERROR:", err);
    res.status(500).json({ success: false, message: "Error updating menu" });
  }
};

// DELETE MENU
exports.remove = async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.menus.delete({
      where: { menu_id: id }
    });

    res.json({ success: true, message: "Menu deleted" });
  } catch (err) {
    console.error("❌ MENU DELETE ERROR:", err);
    res.status(500).json({ success: false, message: "Error deleting menu" });
  }
};
