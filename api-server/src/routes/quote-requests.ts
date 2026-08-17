import { Router, type IRouter } from "express";
import { db, quoteRequestsTable } from "@workspace/db";
import {
  CreateQuoteRequestBody,
  CreateQuoteRequestResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/quote-requests", async (req, res): Promise<void> => {
  const parsed = CreateQuoteRequestBody.safeParse(req.body);

  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid quote request");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (parsed.data.honeypot?.trim()) {
    res.status(400).json({ error: "Unable to submit request" });
    return;
  }

  const [quoteRequest] = await db
    .insert(quoteRequestsTable)
    .values({
      name: parsed.data.name,
      phone: parsed.data.phone,
      service: parsed.data.service,
      area: parsed.data.area,
      description: parsed.data.description,
      contactMethod: parsed.data.contactMethod,
      photoNames: parsed.data.photoNames ?? [],
    })
    .returning();

  res.status(201).json(
    CreateQuoteRequestResponse.parse({
      ...quoteRequest,
      id: String(quoteRequest.id),
    }),
  );
});

export default router;