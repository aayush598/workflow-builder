import { executeNodeTask } from "@/trigger/execute-node.task";

export type TriggerType = "manual";

export async function fireTrigger(
  _type: TriggerType,
  options: {
    metadata: {
      workflowRunId: string;
      nodeId: string;
    };
  }
) {
  await executeNodeTask.trigger(options.metadata);

  return {
    triggerId: "trigger-dev",
    status: "scheduled",
    scheduledAt: new Date().toISOString(),
  };
}
