import { TemporaryFileBuilder } from "./temporary-file-builder.js";
import { createReadStream } from "fs";
import { join } from "path";

describe("TemporaryFileBuilder", () => {
  let builder: TemporaryFileBuilder;

  beforeEach(() => {
    builder = new TemporaryFileBuilder();
  });

  afterEach(async () => {
    await builder.cleanup();
  });

  it("should create a temporary file with id and file", async () => {
    const fileContent = createReadStream(join(process.cwd(), "/src/tools/temporary-file/__tests__/helpers/example.jpg"));

    await builder
      .withFile(fileContent)
      .create();

    expect(builder.getId()).toBe(builder.getId());
    expect(await builder.verify()).toBe(true);
  });

  it("should throw error when trying to get ID before creation", () => {
    expect(() => builder.getId()).toThrow("No temporary file has been created yet");
  });

  it("should throw error when trying to verify before creation", async () => {
    await expect(builder.verify()).rejects.toThrow("No temporary file has been created yet");
  });
}); 