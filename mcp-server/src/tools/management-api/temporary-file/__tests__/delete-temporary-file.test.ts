import DeleteTemporaryFileTool from "../delete/delete-temporary-file.js";
import { TemporaryFileBuilder } from "./helpers/temporary-file-builder.js";
import { TemporaryFileTestHelper } from "./helpers/temporary-file-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";
import { createSnapshotResult } from "@/helpers/test-utils.js";

describe("delete-temporary-file", () => {

  let originalConsoleError: typeof console.error;
  const builder = new TemporaryFileBuilder();

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
  });

  it("should delete a temporary file", async () => {
    await builder
      .withExampleFile()
      .create();

    const result = await DeleteTemporaryFileTool().handler({
      id: builder.getId()
    }, { signal: new AbortController().signal });

    expect(createSnapshotResult(result, builder.getId())).toMatchSnapshot();
    const items = await TemporaryFileTestHelper.findTemporaryFiles(builder.getId());
    expect(items).toHaveLength(0);
  });

  it("should handle non-existent temporary file", async () => {
    const result = await DeleteTemporaryFileTool().handler({
      id: BLANK_UUID
    }, { signal: new AbortController().signal });
    expect(result).toMatchSnapshot();
  });
}); 