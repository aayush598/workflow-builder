import { describe, it, expect } from "vitest";
import { renderWithProviders } from "@/tests/utils/render";
import WorkflowCanvas from "@/components/canvas/WorkflowCanvas";

describe("WorkflowCanvas", () => {
    it("renders canvas", () => {
        const { getByTestId } = renderWithProviders(<WorkflowCanvas />);
        expect(getByTestId("workflow-canvas")).toBeInTheDocument();
    });
});
