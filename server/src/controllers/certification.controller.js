exports.getAllCertifications = async (req, res) => {
  try {
    const certs = await prisma.certification.findMany({
      include: {
        exams: true,
      },
    });

    const formatted = certs.map(c => ({
      id: c.certification_id,
      title: c.certification_name,
      description: c.certification_description,
      image: c.certification_image_path,
      testsCount: c.exams.length,
    }));

    res.json({ success: true, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCertificationById = async (req, res) => {
  const { id } = req.params;

  try {
    const cert = await prisma.certification.findUnique({
      where: { certification_id: Number(id) },
      include: {
        exams: true,   // 👈 Fetch mock tests
      },
    });

    if (!cert)
      return res.status(404).json({ success: false, message: "Certification not found" });

    res.json({
      success: true,
      data: {
        id: cert.certification_id,
        certification_name: cert.certification_name,
        certification_description: cert.certification_description,
        certification_image_path: cert.certification_image_path,
        testsCount: cert.exams.length,
        tests: cert.exams,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
