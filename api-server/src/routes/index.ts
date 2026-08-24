import { Router, type IRouter } from "express";
import healthRouter from "./health";
import quoteRequestsRouter from "./quote-requests";
import authRouter from "./auth";
import adminServicesRouter from "./admin-services";
import adminLeadsRouter from "./admin-leads";
import adminSettingsRouter from "./admin-settings";
import adminBlogRouter from "./admin-blog";
import interactiveModulesRouter from "./interactive-modules";

const router: IRouter = Router();

router.use(healthRouter);
router.use(quoteRequestsRouter);
router.use(authRouter);
router.use(adminServicesRouter);
router.use(adminLeadsRouter);
router.use(adminSettingsRouter);
router.use(adminBlogRouter);
router.use(interactiveModulesRouter);

export default router;
