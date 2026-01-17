import { describe, it, expect } from "vitest";
import { executeWorkflow } from "@/domain/workflow/executor";
import workflow from "@/tests/fixtures/workflows/valid-workflow.json";

describe("Full Workflow Execution", () => {
    it("executes workflow successfully", async () => {
        const result = await executeWorkflow(workflow as any);
        expect(result[0].status).toBe("success");
    });
});
