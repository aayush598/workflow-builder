import { describe, it, expect } from "vitest";
import { TextNodeSchema } from "@/domain/nodes/node-schemas";

describe("Text Node Schema", () => {
    it("accepts valid text node", () => {
        const result = TextNodeSchema.safeParse({
            text: "hello",
        });
        expect(result.success).toBe(true);
    });

    it("rejects invalid text node", () => {
        const result = TextNodeSchema.safeParse({ text: 123 });
        expect(result.success).toBe(false);
    });
});
