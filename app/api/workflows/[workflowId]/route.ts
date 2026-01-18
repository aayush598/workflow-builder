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

        const [metadata, loaded] = await Promise.all([
            workflowService.getByIdForUser(params.workflowId, userId),
            workflowService.loadWorkflow(params.workflowId),
        ]);

        return successResponse({
            ...metadata,
            graph: loaded?.graph ?? { nodes: [], edges: [] },
        });
    })
);

/**
 * PATCH /api/workflows/:id
 */
const updateWorkflowSchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    isArchived: z.boolean().optional(),
    graph: z.object({
        nodes: z.array(z.any()),
        edges: z.array(z.any()),
    }).optional(),
});

export const PATCH = withErrorHandler(
    withAuth(
        withValidation(updateWorkflowSchema, async (_req, body, context: any) => {
            const { userId } = await requireAuth();
            const params = await context.params;

            const { graph, ...meta } = body;

            if (graph) {
                await workflowService.saveNewVersion(params.workflowId, graph);
            }

            const workflow = await workflowService.updateForUser(
                params.workflowId,
                userId,
                meta
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
