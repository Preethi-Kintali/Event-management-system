import { Request, Response } from "express";
import { CertificateService } from "../services/certificates.service";

export class CertificateController {
  static async getAll(req: Request, res: Response) {
    const tenantId = req.tenantId!;
    const certificates = await CertificateService.findAll(tenantId);
    res.json(certificates);
  }

  static async getById(req: Request, res: Response) {
    const tenantId = req.tenantId!;
    const { id } = req.params;
    const certificate = await CertificateService.findById(tenantId, id);
    if (!certificate) return res.status(404).json({ error: "Certificate not found" });
    res.json(certificate);
  }

  static async verify(req: Request, res: Response) {
    const { code } = req.params;
    const certificate = await CertificateService.findByVerificationCode(code);
    if (!certificate) return res.status(404).json({ error: "Certificate not found or invalid code" });
    res.json(certificate);
  }

  static async create(req: Request, res: Response) {
    const tenantId = req.tenantId!;
    const userId = req.user!.userId;
    const certificate = await CertificateService.create(tenantId, userId, req.body);
    res.status(201).json(certificate);
  }

  static async update(req: Request, res: Response) {
    const tenantId = req.tenantId!;
    const userId = req.user!.userId;
    const { id } = req.params;
    const certificate = await CertificateService.update(tenantId, userId, id, req.body);
    if (!certificate) return res.status(404).json({ error: "Certificate not found" });
    res.json(certificate);
  }

  static async bulkIssue(req: Request, res: Response) {
    const tenantId = req.tenantId!;
    const adminId = req.user!.userId;
    const { eventId, userIds, type, title, description } = req.body;
    const result = await CertificateService.bulkIssue(tenantId, adminId, eventId, userIds, type, title, description);
    res.status(201).json(result);
  }

  static async revoke(req: Request, res: Response) {
    const tenantId = req.tenantId!;
    const userId = req.user!.userId;
    const { id } = req.params;
    const certificate = await CertificateService.revoke(tenantId, userId, id);
    if (!certificate) return res.status(404).json({ error: "Certificate not found" });
    res.json(certificate);
  }

  static async delete(req: Request, res: Response) {
    const tenantId = req.tenantId!;
    const userId = req.user!.userId;
    const { id } = req.params;
    const certificate = await CertificateService.delete(tenantId, userId, id);
    if (!certificate) return res.status(404).json({ error: "Certificate not found" });
    res.status(204).send();
  }

  static async download(req: Request, res: Response) {
    const tenantId = req.tenantId!;
    const { id } = req.params;
    const certificate = await CertificateService.findById(tenantId, id);
    if (!certificate) return res.status(404).json({ error: "Certificate not found" });
    
    // Placeholder implementation for PDF download
    // Since PDF generation is too large for current architecture, we return a mock URL.
    res.json({ url: `https://fake-s3-bucket.ascent.dev/certificates/${certificate.certificateNumber}.pdf` });
  }
}
