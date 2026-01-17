import { describe, it, expect } from "vitest";
import { validateDag } from "@/domain/workflow/dag";
import validWorkflow from "@/tests/fixtures/workflows/valid-workflow.json";
import cyclicWorkflow from "@/tests/fixtures/workflows/cyclic-workflow.json";

describe("DAG Validation", () => {
    it("accepts valid DAG", () => {
        expect(validateDag(validWorkflow as any).valid).toBe(true);
    });

    it("rejects cyclic DAG", () => {
        expect(validateDag(cyclicWorkflow as any).valid).toBe(false);
    });
});
