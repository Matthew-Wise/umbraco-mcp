import { createContainerHierarchy } from '../post/helpers/create-container-hierarchy.js';
import type { Container } from '../post/helpers/create-container-hierarchy.js';
import { jest } from '@jest/globals';

// Mock the entire uuid module
jest.mock('uuid', () => {
  let counter = 0;
  return {
    v4: () => `uuid-${counter++}`
  };
});

describe('createContainerHierarchy', () => {
  beforeEach(() => {
    // Reset the counter before each test
    jest.clearAllMocks();
  });

  it('should create tabs and groups with correct hierarchy', () => {
    const properties = [
      {
        name: 'Property 1',
        alias: 'property1',
        dataTypeId: 'data-type-1',
        tab: 'Tab 1',
        group: 'Group 1'
      },
      {
        name: 'Property 2',
        alias: 'property2',
        dataTypeId: 'data-type-2',
        tab: 'Tab 1',
        group: 'Group 2'
      },
      {
        name: 'Property 3',
        alias: 'property3',
        dataTypeId: 'data-type-3',
        tab: 'Tab 2'
      }
    ];

    const result = createContainerHierarchy(properties);

    // Check containers array
    expect(result.containers).toHaveLength(4); // 2 tabs + 2 groups
    expect(result.containers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Tab 1',
          type: 'Tab',
          parent: null
        }),
        expect.objectContaining({
          name: 'Tab 2',
          type: 'Tab',
          parent: null
        }),
        expect.objectContaining({
          name: 'Group 1',
          type: 'Group',
          parent: expect.objectContaining({
            id: expect.any(String)
          })
        }),
        expect.objectContaining({
          name: 'Group 2',
          type: 'Group',
          parent: expect.objectContaining({
            id: expect.any(String)
          })
        })
      ])
    );

    // Check container IDs map
    expect(result.containerIds.get('Tab 1')).toBeDefined();
    expect(result.containerIds.get('Tab 2')).toBeDefined();
    expect(result.containerIds.get('Group 1')).toBeDefined();
    expect(result.containerIds.get('Group 2')).toBeDefined();

    // Verify group parents point to correct tab
    const tab1Id = result.containerIds.get('Tab 1');
    const group1 = result.containers.find((c: Container) => c.name === 'Group 1');
    const group2 = result.containers.find((c: Container) => c.name === 'Group 2');
    expect(group1?.parent?.id).toBe(tab1Id);
    expect(group2?.parent?.id).toBe(tab1Id);
  });

  it('should handle properties without tabs or groups', () => {
    const properties = [
      {
        name: 'Property 1',
        alias: 'property1',
        dataTypeId: 'data-type-1'
      },
      {
        name: 'Property 2',
        alias: 'property2',
        dataTypeId: 'data-type-2',
        tab: 'Tab 1'
      }
    ];

    const result = createContainerHierarchy(properties);

    expect(result.containers).toHaveLength(1); // Only one tab
    expect(result.containers[0]).toEqual(
      expect.objectContaining({
        name: 'Tab 1',
        type: 'Tab',
        parent: null
      })
    );
  });

  it('should create groups at root level when no tab is specified', () => {
    const properties = [
      {
        name: 'Property 1',
        alias: 'property1',
        dataTypeId: 'data-type-1',
        group: 'Group 1' // No tab specified
      }
    ];

    const result = createContainerHierarchy(properties);

    expect(result.containers).toHaveLength(1); // One group at root level
    expect(result.containers[0]).toEqual(
      expect.objectContaining({
        name: 'Group 1',
        type: 'Group',
        parent: null
      })
    );
    expect(result.containerIds.size).toBe(1);
    expect(result.containerIds.get('Group 1')).toBeDefined();
  });

  it('should handle empty properties array', () => {
    const result = createContainerHierarchy([]);

    expect(result.containers).toHaveLength(0);
    expect(result.containerIds.size).toBe(0);
  });

  it('should generate unique IDs for all containers', () => {
    const properties = [
      {
        name: 'Property 1',
        alias: 'property1',
        dataTypeId: 'data-type-1',
        tab: 'Tab 1',
        group: 'Group 1'
      },
      {
        name: 'Property 2',
        alias: 'property2',
        dataTypeId: 'data-type-2',
        tab: 'Tab 1'
      },
      {
        name: 'Property 3',
        alias: 'property3',
        dataTypeId: 'data-type-3',
        group: 'Group 2'
      }
    ];

    const result = createContainerHierarchy(properties);

    // Get container IDs
    const tab1Id = result.containerIds.get('Tab 1');
    const group1Id = result.containerIds.get('Group 1');
    const group2Id = result.containerIds.get('Group 2');

    // Verify container IDs are defined
    expect(tab1Id).toBeDefined();
    expect(group1Id).toBeDefined();
    expect(group2Id).toBeDefined();

    // Verify container IDs are unique
    expect(tab1Id).not.toBe(group1Id);
    expect(tab1Id).not.toBe(group2Id);
    expect(group1Id).not.toBe(group2Id);

    // Verify container IDs are used in the containers array
    const tab1 = result.containers.find(c => c.id === tab1Id);
    const group1 = result.containers.find(c => c.id === group1Id);
    const group2 = result.containers.find(c => c.id === group2Id);

    expect(tab1).toBeDefined();
    expect(group1).toBeDefined();
    expect(group2).toBeDefined();

    // Verify container relationships
    expect(group1?.parent?.id).toBe(tab1Id);
    expect(group2?.parent).toBeNull();
  });
}); 