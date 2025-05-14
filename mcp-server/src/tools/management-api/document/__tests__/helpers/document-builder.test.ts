import { DocumentBuilder } from "./document-builder.js";
import { DocumentTestHelper } from "./document-test-helper.js";
import { jest } from "@jest/globals";
import { TEST_DOMAIN } from "./document-builder.js";
import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { MemberGroupBuilder } from "../../../member-group/__tests__/helpers/member-group-builder.js";
import { MemberGroupTestHelper } from "../../../member-group/__tests__/helpers/member-group-helper.js";
import { BLANK_UUID } from "../../../constants.js";

const TEST_DOCUMENT_NAME = "_Test DocumentBuilder";
const TEST_RECYCLE_BIN_DOCUMENT_NAME = "_Test DocumentBuilder RecycleBin";
const TEST_PUBLISHED_DOCUMENT_NAME = "_Test DocumentBuilder Published";
const TEST_DOMAINS_DOCUMENT_NAME = "_Test DocumentBuilder Domains";
const TEST_PUBLIC_ACCESS_DOCUMENT_NAME = "_Test DocumentBuilder PublicAccess";
const TEST_MEMBER_GROUP_NAME = "_Test Builder PublicAccess MemberGroup";
const TEST_UPDATE_DOCUMENT_NAME = "_Test Document Builder Update";
const TEST_UPDATED_DOCUMENT_NAME = "_Test Document Builder Updated";

describe("DocumentBuilder", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await DocumentTestHelper.cleanup(TEST_DOCUMENT_NAME);
    await DocumentTestHelper.cleanup(TEST_RECYCLE_BIN_DOCUMENT_NAME);
    await DocumentTestHelper.cleanup(TEST_PUBLISHED_DOCUMENT_NAME);
    await DocumentTestHelper.cleanup(TEST_DOMAINS_DOCUMENT_NAME);
    await DocumentTestHelper.cleanup(TEST_PUBLIC_ACCESS_DOCUMENT_NAME);
    await MemberGroupTestHelper.cleanup(TEST_MEMBER_GROUP_NAME);
    await DocumentTestHelper.cleanup(TEST_UPDATE_DOCUMENT_NAME);
    await DocumentTestHelper.cleanup(TEST_UPDATED_DOCUMENT_NAME);
  });

  it("should create a document and find it by name", async () => {
    const builder = await new DocumentBuilder()
      .withName(TEST_DOCUMENT_NAME)
      .withRootDocumentType()
      .create();

    const found = await DocumentTestHelper.findDocument(TEST_DOCUMENT_NAME);
    expect(found).toBeDefined();
    expect(DocumentTestHelper.getNameFromItem(found)).toBe(TEST_DOCUMENT_NAME);
  });

  it("should return the created document's id and item", async () => {
    const builder = await new DocumentBuilder()
      .withName(TEST_DOCUMENT_NAME)
      .withRootDocumentType()
      .create();

    const id = builder.getId();
    const item = builder.getCreatedItem();
    expect(id).toBeDefined();
    expect(item).toBeDefined();
    expect(DocumentTestHelper.getNameFromItem(item)).toBe(TEST_DOCUMENT_NAME);
  });

  it("moveToRecycleBin should move a created document to the recycle bin", async () => {
    const builder = await new DocumentBuilder()
      .withName(TEST_RECYCLE_BIN_DOCUMENT_NAME)
      .withRootDocumentType()
      .create();
    await builder.moveToRecycleBin();
    const foundNormal = await DocumentTestHelper.findDocument(TEST_RECYCLE_BIN_DOCUMENT_NAME);
    expect(foundNormal).toBeUndefined();
    const foundRecycleBin = await DocumentTestHelper.findDocumentInRecycleBin(TEST_RECYCLE_BIN_DOCUMENT_NAME);
    expect(foundRecycleBin).toBeDefined();
    expect(foundRecycleBin!.variants[0].name).toBe(TEST_RECYCLE_BIN_DOCUMENT_NAME);
  });

  it("moveToRecycleBin should throw if called before create", async () => {
    const builder = new DocumentBuilder().withName("_Test MoveToRecycleBin Error").withRootDocumentType();
    await expect(builder.moveToRecycleBin()).rejects.toThrow(/No document has been created yet/);
  });

  it("publish should publish a created document", async () => {
    const builder = await new DocumentBuilder()
      .withName(TEST_PUBLISHED_DOCUMENT_NAME)
      .withRootDocumentType()
      .create();
    await expect(builder.publish()).resolves.toBe(builder);
    // Check the published state
    const found = await DocumentTestHelper.findDocument(TEST_PUBLISHED_DOCUMENT_NAME);
    expect(found).toBeDefined();
    const isPublished = found?.variants.some((v: any) => v.state === "Published");
    expect(isPublished).toBe(true);
  });

  it("publish should throw if called before create", async () => {
    const builder = new DocumentBuilder().withName("_Test PublishBuilder Error").withRootDocumentType();
    await expect(builder.publish()).rejects.toThrow(/No document has been created yet/);
  });

  it("should set domains for a document using setDomains", async () => {
    const builder = await new DocumentBuilder()
      .withName(TEST_DOMAINS_DOCUMENT_NAME)
      .withRootDocumentType()
      .create();
    await builder.setDomains([TEST_DOMAIN], null);
    const client = UmbracoManagementClient.getClient();
    const domains = await client.getDocumentByIdDomains(builder.getId());
    expect(domains).toMatchSnapshot();
    expect(domains.domains).toEqual(
      expect.arrayContaining([
        expect.objectContaining(TEST_DOMAIN)
      ])
    );
  });

  it("should set public access for a document using setPublicAccess", async () => {
    await new MemberGroupBuilder().withName(TEST_MEMBER_GROUP_NAME).create();
    // Create document
    const builder = await new DocumentBuilder()
      .withName(TEST_PUBLIC_ACCESS_DOCUMENT_NAME)
      .withRootDocumentType()
      .create();
    // Set public access
    await builder.setPublicAccess(TEST_MEMBER_GROUP_NAME);
    // Fetch public access using the client
    const client = UmbracoManagementClient.getClient();
    const response = await client.getDocumentByIdPublicAccess(builder.getId());
    // Normalize IDs for snapshot
    response.loginDocument.id = BLANK_UUID;
    response.errorDocument.id = BLANK_UUID;
    if (Array.isArray(response.groups)) {
      response.groups.forEach((g: any) => { g.id = BLANK_UUID; });
    }
    expect(response).toMatchSnapshot();
  });

  it("should update a document", async () => {
    const builder = await new DocumentBuilder()
      .withName(TEST_UPDATE_DOCUMENT_NAME)
      .withRootDocumentType()
      .create();

    await builder.publish();
    await builder.updateName(TEST_UPDATED_DOCUMENT_NAME);
    await builder.publish();

    const item = builder.getCreatedItem();
    expect(item).toBeDefined();
    expect(DocumentTestHelper.getNameFromItem(item)).toBe(TEST_UPDATED_DOCUMENT_NAME);

    const foundNormal = await DocumentTestHelper.findDocument(TEST_RECYCLE_BIN_DOCUMENT_NAME);
    expect(foundNormal).toBeUndefined();
  });

}); 