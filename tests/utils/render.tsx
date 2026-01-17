import { render } from "@testing-library/react";
import { ReactNode } from "react";
import { ReactFlowProvider } from "@xyflow/react";

export const renderWithProviders = (ui: ReactNode) => {
    return render(
        <ReactFlowProvider>
            {ui}
        </ReactFlowProvider>
    );
};
