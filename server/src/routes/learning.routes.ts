import { Router } from "express";
import { LearningController } from "../controllers/learning.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireTenant } from "../middleware/tenant.middleware";
import { requirePermission } from "../middleware/rbac.middleware";

const router = Router();

router.use(requireAuth);
router.use(requireTenant);

// Phase 4D Dashboard
router.get("/dashboard", requirePermission("learning.read"), LearningController.getDashboardStats);

// Courses
router.get("/courses", requirePermission("learning.read"), LearningController.getCourses);
router.post("/courses", requirePermission("learning.manage"), LearningController.createCourse);
router.get("/courses/:id", requirePermission("learning.read"), LearningController.getCourseById);
router.patch("/courses/:id", requirePermission("learning.manage"), LearningController.updateCourse);
router.delete("/courses/:id", requirePermission("learning.manage"), LearningController.deleteCourse);

// Course Enrollments
router.get("/courses/:id/enrollments", requirePermission("learning.manage"), LearningController.getEnrollments);
router.post("/courses/:id/enroll", requirePermission("learning.read"), LearningController.enroll);
router.patch("/courses/:id/enrollments/:userId", requirePermission("learning.manage"), LearningController.updateEnrollment);

// Resources
router.get("/resources", requirePermission("learning.read"), LearningController.getResources);
router.post("/resources", requirePermission("learning.manage"), LearningController.createResource);
router.patch("/resources/:id", requirePermission("learning.manage"), LearningController.updateResource);
router.delete("/resources/:id", requirePermission("learning.manage"), LearningController.deleteResource);

// Workshops
router.get("/workshops", requirePermission("learning.read"), LearningController.getWorkshops);
router.post("/workshops", requirePermission("learning.manage"), LearningController.createWorkshop);
router.patch("/workshops/:id", requirePermission("learning.manage"), LearningController.updateWorkshop);
router.delete("/workshops/:id", requirePermission("learning.manage"), LearningController.deleteWorkshop);

export default router;
