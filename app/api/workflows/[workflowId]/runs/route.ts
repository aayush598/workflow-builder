import { withAuth } from '@/api/middlewares/with-auth';
import { withErrorHandler } from '@/api/middlewares/with-error-handler';
import { successResponse } from '@/api/responses/success.response';
import { requireAuth } from '@/auth/auth-guards';
import { workflowService } from '@/database/services/workflow.service';
import { executionService } from '@/database/services/execution.service';
import { WorkflowRunScope } from '@prisma/client';
import { NotFoundError } from '@/api/errors/not-found.error';

type RouteContext = {
  params: Promise<{
    workflowId: string;
  }>;
};

/**
 * POST /api/workflows/:workflowId/runs
 */
export const POST = withErrorHandler(
  withAuth(async (_req, context) => {
    // ✅ Narrow context safely
    const { params } = context as RouteContext;
    const { workflowId } = await params;

    if (!workflowId) {
      throw new NotFoundError('Workflow not found');
    }

    // 1. Authenticated DB user
    const { userId } = await requireAuth();

    // 2. Ownership validation
    await workflowService.getByIdForUser(workflowId, userId);

    // 3. Load latest workflow version
    let loaded = await workflowService.loadWorkflow(workflowId);

    if (!loaded) {
      // Lazy initialization: Create version 1 if no versions exist
      await workflowService.saveNewVersion(workflowId, { nodes: [], edges: [] });
      loaded = await workflowService.loadWorkflow(workflowId);
    }

    if (!loaded) {
      throw new NotFoundError('Workflow version not found');
    }

    // 4. Create workflow run
    const run = await executionService.startWorkflowRun({
      workflowId: workflowId,
      workflowVersionId: loaded.version.id,
      userId,
      scope: WorkflowRunScope.FULL,
    });

    // 5. Return execution metadata
    return successResponse(
      {
        runId: run.id,
        workflowId: run.workflowId,
        status: run.status,
        startedAt: run.startedAt,
      },
      201
    );
  })
);
