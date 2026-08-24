import { Router, type IRouter } from "express";
import healthRouter from "./health";
import quoteRequestsRouter from "./quote-requests";
import authRouter from "./auth";
import publicRouter from "./public";
import adminServicesRouter from "./admin-services";
import adminLeadsRouter from "./admin-leads";
import adminSettingsRouter from "./admin-settings";
import adminBlogRouter from "./admin-blog";
import adminFaqsRouter from "./admin-faqs";
import adminApplicationsRouter from "./admin-applications";
import adminGalleriesRouter from "./admin-galleries";
import adminNavigationRouter from "./admin-navigation";
import adminMediaRouter from "./admin-media";
import interactiveModulesRouter from "./interactive-modules";

const router: IRouter = Router();

router.use(healthRouter);
router.use(quoteRequestsRouter);
router.use(authRouter);
router.use(publicRouter);
router.use(adminServicesRouter);
router.use(adminLeadsRouter);
router.use(adminSettingsRouter);
router.use(adminBlogRouter);
router.use(adminFaqsRouter);
router.use(adminApplicationsRouter);
router.use(adminGalleriesRouter);
router.use(adminNavigationRouter);
router.use(adminMediaRouter);
router.use(interactiveModulesRouter);

export default router;
