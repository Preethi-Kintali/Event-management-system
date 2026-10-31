import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { SubmissionService } from "../services/submissions.service";

export class SubmissionController {
  static async findAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.tenantId as string;
      const filters = {
        eventId: req.query.eventId as string,
        roundId: req.query.roundId as string,
        roundNumber: req.query.roundNumber ? Number(req.query.roundNumber) : undefined,
        problemStatementId: req.query.problemStatementId as string,
        status: req.query.status as string,
        judgeId: req.query.judgeId as string,
        userId: req.query.userId as string,
      };
      const subs = await SubmissionService.getSubmissions(tenantId, filters, req.user?.id);
      res.json({ success: true, data: subs });
    } catch (error) { next(error); }
  }

  static async assignJudge(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.tenantId as string;
      const { judgeId } = req.body;
      const assignment = await SubmissionService.assignJudge(tenantId, req.params.id, judgeId, req.user?.id);
      res.status(201).json({ success: true, data: assignment });
    } catch (error) { next(error); }
  }

  static async unassignJudge(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.tenantId as string;
      await SubmissionService.unassignJudge(tenantId, req.params.id, req.params.judgeId, req.user?.id);
      res.json({ success: true, data: { unassigned: true } });
    } catch (error) { next(error); }
  }

  static async findById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.tenantId as string;
      const sub = await SubmissionService.getSubmission(tenantId, req.params.id, req.user?.id);
      res.json({ success: true, data: sub });
    } catch (error) { next(error); }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.tenantId as string;
      const sub = await SubmissionService.createSubmission(tenantId, req.body, req.user?.id);
      res.status(201).json({ success: true, data: sub });
    } catch (error) { next(error); }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.tenantId as string;
      const sub = await SubmissionService.updateSubmission(tenantId, req.params.id, req.body, req.user?.id);
      res.json({ success: true, data: sub });
    } catch (error) { next(error); }
  }

  static async uploadFile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const file = await SubmissionService.addSubmissionFile(req.user!.id, req.params.id, req.body);
      res.status(201).json({ success: true, data: file });
    } catch (error) { next(error); }
  }

  static async finalSubmit(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const description = req.body?.description || req.body?.content;
      const sub = await SubmissionService.finalSubmit(req.user!.id, req.params.id, description);
      res.json({ success: true, data: sub });
    } catch (error) { next(error); }
  }

  static async viewFile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id: submissionId, fileId } = req.params;
      const file = await SubmissionService.getFileForView(req.user!.id, submissionId, fileId);

      const path = await import("path");
      const fs = await import("fs");
      const cleanFileName = path.basename(file.fileName);
      const possiblePaths = [
        path.resolve(process.cwd(), "uploads", cleanFileName),
        path.resolve(process.cwd(), "public", "uploads", cleanFileName),
      ];

      for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
          const mimeTypes: Record<string, string> = {
            pdf: "application/pdf",
            png: "image/png",
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            mp4: "video/mp4",
            mov: "video/quicktime",
            doc: "application/msword",
            docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          };
          const ext = cleanFileName.split(".").pop()?.toLowerCase() || "";
          const contentType = mimeTypes[ext] || "application/octet-stream";
          res.setHeader("Content-Type", contentType);
          res.setHeader("Content-Disposition", `inline; filename="${cleanFileName}"`);
          return fs.createReadStream(p).pipe(res);
        }
      }

      // Secure inline HTML preview
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Content-Disposition", "inline");
      res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>View Document - ${file.fileName}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 24px; box-sizing: border-box; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 36px; max-width: 560px; width: 100%; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    h1 { font-size: 20px; font-weight: 700; margin-bottom: 12px; color: #38bdf8; }
    p { font-size: 14px; color: #94a3b8; line-height: 1.6; margin: 8px 0; }
    .file-badge { display: inline-block; background: #0284c7; color: #ffffff; padding: 8px 16px; border-radius: 8px; font-family: monospace; font-size: 13px; font-weight: 600; margin: 18px 0; word-break: break-all; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Authorized Submission Document Viewer</h1>
    <div class="file-badge">${file.fileName}</div>
    <p>File Size: ${(file.fileSize / 1024).toFixed(1)} KB | Format: ${file.fileType}</p>
    <p style="font-size: 12px; color: #64748b; margin-top: 16px;">This is an authorized view-only preview for Eventura participants, evaluators, and staff.</p>
  </div>
</body>
</html>`);
    } catch (error) { next(error); }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.tenantId as string;
      await SubmissionService.deleteSubmission(tenantId, req.params.id, req.user?.id);
      res.json({ success: true, data: { deleted: true } });
    } catch (error) { next(error); }
  }
}
