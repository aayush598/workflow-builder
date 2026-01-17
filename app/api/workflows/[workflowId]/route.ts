import { withAuth } from '@/api/middlewares/with-auth';
import { withErrorHandler } from '@/api/middlewares/with-error-handler';
import { withValidation } from '@/api/middlewares/with-validation';
import { successResponse } from '@/api/responses/success.response';
import { requireAuth } from '@/auth/auth-guards';
import { workflowService } from '@/database/services/workflow.service';
import { z } from 'zod';

type Params = {
    params: {
        workflowId: string;
    };
};

/**
 * GET /api/workflows/:id
 */
export const GET = withErrorHandler(
    withAuth(async (_req, context: any) => {
        const { userId } = await requireAuth();
        const params = await context.params;

        const workflow = await workflowService.getByIdForUser(
            params.workflowId,
            userId
        );

        return successResponse(workflow);
    })
);

/**
 * PATCH /api/workflows/:id
 */
const updateWorkflowSchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    isArchived: z.boolean().optional(),
});

export const PATCH = withErrorHandler(
    withAuth(
        withValidation(updateWorkflowSchema, async (_req, body, context: any) => {
            const { userId } = await requireAuth();
            const params = await context.params;

            const workflow = await workflowService.updateForUser(
                params.workflowId,
                userId,
                body
            );

            return successResponse(workflow);
        })
    )
);

/**
 * DELETE /api/workflows/:id
 */
export const DELETE = withErrorHandler(
    withAuth(async (_req, context: any) => {
        const { userId } = await requireAuth();
        const params = await context.params;

        await workflowService.deleteForUser(params.workflowId, userId);

        return successResponse({ deleted: true });
    })
);
