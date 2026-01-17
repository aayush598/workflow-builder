import { vi } from "vitest";

vi.mock("@/services/trigger.service", () => ({
    triggerTask: vi.fn(async () => ({
        status: "success",
        output: "mock-output",
        duration: 1234,
    })),
}));
