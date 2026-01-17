import { describe, it, expect } from "vitest";
import useWorkflowStore from "@/store/workflow.store";

describe("Workflow Store", () => {
    it("adds a node", () => {
        const store = useWorkflowStore.getState();
        store.addNode("text", { x: 0, y: 0 });

        expect(useWorkflowStore.getState().nodes.length).toBe(1);
    });
});
