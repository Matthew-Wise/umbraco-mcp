import { createSnapshotResult } from "@/helpers/test-utils.js";
import CreateTemporaryFileTool from "../post/create-temporary-file.js";
import { TemporaryFileTestHelper } from "./helpers/temporary-file-helper.js";
import { jest } from "@jest/globals";
import { createReadStream } from "fs";
import { join } from "path";
import { v4 as uuidv4 } from 'uuid';

describe("create-temporary-file", () => {
  let originalConsoleError: typeof console.error;
  let testId = '';

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
    testId = uuidv4();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await TemporaryFileTestHelper.cleanup(testId);
  });

  it("should create a temporary file", async () => {

    const fileStream = createReadStream(join(process.cwd(), "/src/tools/temporary-file/__tests__/helpers/example.jpg"));
    const result = await CreateTemporaryFileTool().handler({
      Id: testId,
      File: fileStream
    }, { signal: new AbortController().signal });

    expect(createSnapshotResult(result, testId)).toMatchSnapshot();

    const items = await TemporaryFileTestHelper.findTemporaryFiles(testId);
    items[0].id = "NORMALIZED_ID";
    items[0].availableUntil = "NORMALIZED_DATE";
    expect(items).toMatchSnapshot();
  });

  it("should handle file not found", async () => {
    const result = await CreateTemporaryFileTool().handler({
      Id: "test-id",
      File: createReadStream("nonexistent.jpg")
    }, { signal: new AbortController().signal });

    expect(result).toMatchSnapshot();
  });
}); 