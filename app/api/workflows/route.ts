import { withAuth } from '@/api/middlewares/with-auth';
import { withErrorHandler } from '@/api/middlewares/with-error-handler';
import { withValidation } from '@/api/middlewares/with-validation';
import { successResponse } from '@/api/responses/success.response';
import { requireAuth } from '@/auth/auth-guards';
import { workflowService } from '@/database/services/workflow.service';
import { z } from 'zod';

/**
 * GET /api/workflows
 * List workflows for current user
 */
export const GET = withErrorHandler(
    withAuth(async () => {
        const { userId } = await requireAuth();

        const workflows = await workflowService.listByUserId(userId);

        return successResponse(workflows);
    })
);

/**
 * POST /api/workflows
 * Create a new workflow
 */
const createWorkflowSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
});

export const POST = withErrorHandler(
    withAuth(
        withValidation(createWorkflowSchema, async (_req, body) => {
            const { userId } = await requireAuth();

            const workflow = await workflowService.create({
                userId,
                name: body.name,
                description: body.description,
            });

            return successResponse(workflow, 201);
        })
    )
);
