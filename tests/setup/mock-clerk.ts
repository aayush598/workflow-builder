import { vi } from "vitest";

vi.mock("@clerk/nextjs", () => ({
    auth: () => ({
        userId: "test-user",
    }),
    useAuth: () => ({
        isSignedIn: true,
        userId: "test-user",
    }),
    ClerkProvider: ({ children }: any) => children,
}));
