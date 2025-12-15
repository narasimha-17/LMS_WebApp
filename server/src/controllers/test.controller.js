// controllers/test.controller.ts
import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getQuestionsForTest = async (req: Request, res: Response) => {
  const { id } = req.params;
  const certId = Number(id);
  if (!certId) return res.status(400).json({ error: "Invalid certification id" });

  try {
    // Fetch 65 random ACTIVE questions for the certification using parameterized query
    const questions = await prisma.$queryRaw`
      SELECT *
      FROM questions
      WHERE certification_id = ${certId}
        AND status = 'Active'
      ORDER BY RAND()
      LIMIT 65;
    `;

    if (!questions || questions.length === 0) return res.status(404).json({ error: "No active questions found" });

    return res.json({ certification_id: certId, total_questions: questions.length, questions });
  } catch (error) {
    console.error("❌ getQuestionsForTest error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
