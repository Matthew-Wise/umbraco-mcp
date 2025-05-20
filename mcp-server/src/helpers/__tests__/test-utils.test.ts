import { createSnapshotResult, normalizeErrorResponse } from "../test-utils.js";
import { BLANK_UUID } from "../../tools/constants.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

describe("createSnapshotResult", () => {
  const TEST_UUID = "12345678-1234-1234-1234-123456789012";

  describe("basic functionality", () => {
    it("should return the original result if no content is present", () => {
      // Arrange
      const input = { someOtherField: "value" };

      // Act
      const result = createSnapshotResult(input);

      // Assert
      expect(result).toEqual(input);
    });

    it("should handle non-text content items unchanged", () => {
      // Arrange
      const input = {
        content: [{ type: "image", url: "test.jpg" }],
      };

      // Act
      const result = createSnapshotResult(input);

      // Assert
      expect(result).toEqual(input);
    });
  });

  describe("single item responses", () => {
    it("should replace specified UUID in text content", () => {
      // Arrange
      const input = {
        content: [
          {
            type: "text",
            text: `Some text with UUID: ${TEST_UUID}`,
          },
        ],
      };

      // Act
      const result = createSnapshotResult(input, TEST_UUID);

      // Assert
      expect(result.content[0].text).toContain(BLANK_UUID);
      expect(result.content[0].text).not.toContain(TEST_UUID);
    });

    it("should normalize createDate in single item response", () => {
      const input = {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              id: "some-uuid",
              createDate: "2025-05-03T20:51:08.36+00:00",
              parent: { id: "parent-uuid" },
            }),
          },
        ],
      };
      const result = createSnapshotResult(input, "some-uuid");
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.id).toBe(BLANK_UUID);
      expect(parsed.parent.id).toBe("parent-uuid");
      expect(parsed.createDate).toBe("NORMALIZED_DATE");
    });
  });

  describe("list responses", () => {
    it("should handle array responses with parent relationships", () => {
      // Arrange
      const input = {
        content: [
          {
            type: "text",
            text: JSON.stringify([
              {
                id: TEST_UUID,
                name: "Item 1",
                parent: { id: TEST_UUID, name: "Parent" },
              },
              {
                id: TEST_UUID,
                name: "Item 2",
                parent: null,
              },
            ]),
          },
        ],
      };

      // Act
      const result = createSnapshotResult(input);

      // Assert
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed).toHaveLength(2);
      expect(parsed[0].id).toBe(BLANK_UUID);
      expect(parsed[0].parent.id).toBe(BLANK_UUID);
      expect(parsed[1].id).toBe(BLANK_UUID);
      expect(parsed[1].parent).toBeNull();
    });

    it("should handle items array in object responses", () => {
      // Arrange
      const input = {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              items: [
                {
                  id: TEST_UUID,
                  name: "Item 1",
                  parent: { id: TEST_UUID, name: "Parent" },
                },
                {
                  id: TEST_UUID,
                  name: "Item 2",
                  parent: null,
                },
              ],
              totalItems: 2,
            }),
          },
        ],
      };

      // Act
      const result = createSnapshotResult(input);

      // Assert
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.items).toHaveLength(2);
      expect(parsed.items[0].id).toBe(BLANK_UUID);
      expect(parsed.items[0].parent.id).toBe(BLANK_UUID);
      expect(parsed.items[1].id).toBe(BLANK_UUID);
      expect(parsed.items[1].parent).toBeNull();
      expect(parsed.totalItems).toBe(2);
    });

    it("should normalize createDate in list response (items array)", () => {
      const input = {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              items: [
                {
                  id: "item-uuid-1",
                  createDate: "2025-05-03T20:51:08.36+00:00",
                  parent: { id: "parent-uuid-1" },
                },
                {
                  id: "item-uuid-2",
                  createDate: "2025-05-03T20:51:09.36+00:00",
                  parent: { id: "parent-uuid-2" },
                },
              ],
            }),
          },
        ],
      };
      const result = createSnapshotResult(input);
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.items[0].id).toBe(BLANK_UUID);
      expect(parsed.items[0].parent.id).toBe(BLANK_UUID);
      expect(parsed.items[0].createDate).toBe("NORMALIZED_DATE");
      expect(parsed.items[1].id).toBe(BLANK_UUID);
      expect(parsed.items[1].parent.id).toBe(BLANK_UUID);
      expect(parsed.items[1].createDate).toBe("NORMALIZED_DATE");
    });

    it("should normalize createDate in array response (ancestors)", () => {
      const input = {
        content: [
          {
            type: "text",
            text: JSON.stringify([
              {
                id: "ancestor-uuid-1",
                createDate: "2025-05-03T20:51:08.36+00:00",
                parent: null,
              },
              {
                id: "ancestor-uuid-2",
                createDate: "2025-05-03T20:51:09.36+00:00",
                parent: { id: "ancestor-parent-uuid-2" },
              },
            ]),
          },
        ],
      };
      const result = createSnapshotResult(input);
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed[0].id).toBe(BLANK_UUID);
      expect(parsed[0].createDate).toBe("NORMALIZED_DATE");
      expect(parsed[0].parent).toBeNull();
      expect(parsed[1].id).toBe(BLANK_UUID);
      expect(parsed[1].parent.id).toBe(BLANK_UUID);
      expect(parsed[1].createDate).toBe("NORMALIZED_DATE");
    });
  });

  describe("date normalization (publishDate, updateDate, variants)", () => {
    it("should normalize publishDate and updateDate at the top level", () => {
      const input = {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              id: "some-uuid",
              createDate: "2025-05-03T20:51:08.36+00:00",
              publishDate: "2025-05-04T10:00:00.00+00:00",
              updateDate: "2025-05-05T12:00:00.00+00:00",
              parent: { id: "parent-uuid" },
            }),
          },
        ],
      };
      const result = createSnapshotResult(input, "some-uuid");
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.id).toBe(BLANK_UUID);
      expect(parsed.createDate).toBe("NORMALIZED_DATE");
      expect(parsed.publishDate).toBe("NORMALIZED_DATE");
      expect(parsed.updateDate).toBe("NORMALIZED_DATE");
    });

    it("should normalize date fields inside variants array", () => {
      const input = {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              id: "some-uuid",
              variants: [
                {
                  createDate: "2025-05-03T20:51:08.36+00:00",
                  publishDate: "2025-05-04T10:00:00.00+00:00",
                  updateDate: "2025-05-05T12:00:00.00+00:00",
                },
                {
                  createDate: "2025-06-03T20:51:08.36+00:00",
                  publishDate: "2025-06-04T10:00:00.00+00:00",
                  updateDate: "2025-06-05T12:00:00.00+00:00",
                },
              ],
            }),
          },
        ],
      };
      const result = createSnapshotResult(input, "some-uuid");
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.variants).toHaveLength(2);
      for (const variant of parsed.variants) {
        expect(variant.createDate).toBe("NORMALIZED_DATE");
        expect(variant.publishDate).toBe("NORMALIZED_DATE");
        expect(variant.updateDate).toBe("NORMALIZED_DATE");
      }
    });
  });

  describe("error handling", () => {
    it("should handle invalid JSON in text content", () => {
      // Arrange
      const input = {
        content: [
          {
            type: "text",
            text: "Invalid JSON",
          },
        ],
      };

      // Act & Assert
      expect(() => createSnapshotResult(input)).toThrow();
    });
  });
});

describe("normalizeErrorResponse", () => {
  it("should normalize trace IDs in error response", () => {
    // Arrange
    const input: CallToolResult = {
      content: [
        {
          type: "text",
          text: "Error with trace ID: 00-1234567890abcdef1234567890abcdef-1234567890abcdef-00",
        },
      ],
    };

    // Act
    const result = normalizeErrorResponse(input);

    // Assert
    expect(result.content[0].text).toBe(
      "Error with trace ID: normalized-trace-id"
    );
  });

  it("should handle response without content array", () => {
    // Arrange
    const input: CallToolResult = {
      content: [],
    };

    // Act
    const result = normalizeErrorResponse(input);

    // Assert
    expect(result).toEqual(input);
  });

  it("should handle response with empty content array", () => {
    // Arrange
    const input: CallToolResult = {
      content: [],
    };

    // Act
    const result = normalizeErrorResponse(input);

    // Assert
    expect(result).toEqual(input);
  });

  it("should handle response with non-text content", () => {
    // Arrange
    const input: CallToolResult = {
      content: [
        {
          type: "image",
          data: "base64data",
          mimeType: "image/jpeg",
        },
      ],
    };

    // Act
    const result = normalizeErrorResponse(input);

    // Assert
    expect(result).toEqual(input);
  });

  it("should handle response with text content but no trace ID", () => {
    // Arrange
    const input: CallToolResult = {
      content: [
        {
          type: "text",
          text: "Error without trace ID",
        },
      ],
    };

    // Act
    const result = normalizeErrorResponse(input);

    // Assert
    expect(result).toEqual(input);
  });
});
