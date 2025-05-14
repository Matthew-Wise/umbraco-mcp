import SortDocumentTool from "../put/sort-document.js";
import { DocumentBuilder } from "./helpers/document-builder.js";
import { DocumentTestHelper } from "./helpers/document-test-helper.js";
import { jest } from "@jest/globals";

const TEST_ROOT_NAME = "_Test SortDocument Root";
const TEST_CHILD_NAMES = [
  "_Test SortDocument Child 1",
  "_Test SortDocument Child 2",
  "_Test SortDocument Child 3"
];

describe("sort-document", () => {
  let originalConsoleError: typeof console.error;
  let rootId: string;
  let childIds: string[];

  beforeEach(async () => {
    originalConsoleError = console.error;
    console.error = jest.fn();
    // Create root
    const rootBuilder = await new DocumentBuilder()
      .withName(TEST_ROOT_NAME)
      .withRootDocumentType()
      .create();
    await rootBuilder.publish();
    rootId = rootBuilder.getId();
    // Create children
    childIds = [];
    for (const name of TEST_CHILD_NAMES) {
      const childBuilder = await new DocumentBuilder()
        .withName(name)
        .withContentDocumentType()
        .withParent(rootId)
        .create();
      await childBuilder.publish();
      childIds.push(childBuilder.getId());
    }
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await DocumentTestHelper.cleanup(TEST_ROOT_NAME);
    for (const name of TEST_CHILD_NAMES) {
      await DocumentTestHelper.cleanup(name);
    }
  });

  it("should sort children under a root document", async () => {
    // Reverse the order
    const newOrder = [...childIds].reverse();
    const sorting = newOrder.map((id, idx) => ({ id, sortOrder: idx }));
    const sortResult = await SortDocumentTool().handler({
      parent: { id: rootId },
      sorting
    }, { signal: new AbortController().signal });
    expect(sortResult).toMatchSnapshot();

    // Fetch children after sort
    const fetched = await DocumentTestHelper.getChildren(rootId, 10);
    const fetchedIds = fetched.map(child => child.id);
    expect(fetchedIds).toEqual(newOrder);
  });
}); 