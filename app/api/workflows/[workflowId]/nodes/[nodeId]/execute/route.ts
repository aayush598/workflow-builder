import { NextRequest } from 'next/server';
import { auth } from '@/auth/clerk';
import { withSafeTransaction } from '@/lib/db';
import { prisma } from '@/lib/prisma';
import { fireTrigger } from '@/services/trigger.service';
import { successResponse } from '@/api/responses/success.response';
import { AuthError } from '@/api/errors/auth.error';
import { nodeSnapshotRepository } from '@/database/repositories/node-snapshot.repository';
import { userRepository } from '@/database/repositories/user.repository';


export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ workflowId: string; nodeId: string }> }
) {
    const { userId } = await auth();
    if (!userId) {
        throw new AuthError();
    }

    const { workflowId, nodeId } = await params;

    const result = await withSafeTransaction(async (tx) => {
        /* ------------------------------------------------------------------ */
        /* 0. Resolve internal user (CRITICAL) */
        /* ------------------------------------------------------------------ */
        const user = await userRepository.upsertByClerkId(tx, {
            clerkId: userId,
        });

        /* ------------------------------------------------------------------ */
        /* 1. Resolve node snapshot */
        /* ------------------------------------------------------------------ */
        const snapshots = await nodeSnapshotRepository.findByNodeId(tx, nodeId);

        if (!snapshots.length) {
            throw new Error(`No snapshot found for node ${nodeId}`);
        }

        const nodeSnapshot = snapshots[snapshots.length - 1];

        /* ------------------------------------------------------------------ */
        /* 2. Create workflow run */
        /* ------------------------------------------------------------------ */
        const workflowRun = await tx.workflowRun.create({
            data: {
                workflowId,
                userId: user.id, // ✅ INTERNAL USER ID
                workflowVersionId: nodeSnapshot.workflowVersionId,
                status: 'RUNNING',
                scope: 'SINGLE_NODE',
                startedAt: new Date(),
            },
        });

        /* ------------------------------------------------------------------ */
        /* 3. Create node run */
        /* ------------------------------------------------------------------ */
        await tx.nodeRun.create({
            data: {
                workflowRunId: workflowRun.id,
                nodeId,
                nodeSnapshotId: nodeSnapshot.id,
                status: 'RUNNING',
                startedAt: new Date(),
            },
        });

        return workflowRun;
    });


    /* ------------------------------------------------------------------ */
    /* 4. Fire Trigger.dev task */
    /* ------------------------------------------------------------------ */
    await fireTrigger('manual', {
        metadata: {
            workflowRunId: result.id,
            nodeId,
        },
    });

    return successResponse({
        runId: result.id,
        startedAt: result.startedAt.toISOString(),
    });
}
