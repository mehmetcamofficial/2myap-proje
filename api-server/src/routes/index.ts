import { Router, type IRouter } from "express";
import healthRouter from "./health";
import quoteRequestsRouter from "./quote-requests";

const router: IRouter = Router();

router.use(healthRouter);
router.use(quoteRequestsRouter);

export default router;
