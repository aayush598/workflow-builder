import { v4 as uuid } from "uuid";

export const createTextNode = (overrides = {}) => ({
    id: uuid(),
    type: "text",
    position: { x: 0, y: 0 },
    data: { value: "hello" },
    ...overrides,
});
