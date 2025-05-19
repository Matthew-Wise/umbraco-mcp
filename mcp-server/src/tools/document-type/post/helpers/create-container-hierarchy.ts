import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

// Define the property schema that this helper expects
const propertySchema = z.object({
  name: z.string().min(1, "Property name is required"),
  alias: z.string().min(1, "Property alias is required"),
  dataTypeId: z.string().uuid("Must be a valid UUID"),
  tab: z.string().optional(),
  group: z.string().optional()
});

export type Property = z.infer<typeof propertySchema>;

export interface Container {
  id: string;
  name: string;
  type: "Tab" | "Group";
  parent: { id: string } | null;
  sortOrder: number;
}

interface ContainerCreationResult {
  containers: Container[];
  containerIds: Map<string, string>;
}

/**
 * Creates the container hierarchy for an element type based on property tab and group assignments.
 * @param properties The properties array from the element type model
 * @returns An object containing the containers array and a map of container names to their IDs
 */
export function createContainerHierarchy(properties: Property[]): ContainerCreationResult {
  const containerIds = new Map<string, string>();
  
  // First, collect all unique tab and group names
  const tabs = new Set<string>();
  const groups = new Set<string>();
  properties.forEach(prop => {
    if (prop.tab) tabs.add(prop.tab);
    if (prop.group) groups.add(prop.group);
  });

  // Create containers array with proper hierarchy
  const containers = [
    // Create tabs first
    ...Array.from(tabs).map((tabName, index) => {
      const id = uuidv4();
      containerIds.set(tabName, id);
      return {
        id,
        name: tabName,
        type: "Tab" as const,
        parent: null,
        sortOrder: index
      };
    }),
    // Then create groups, linking to their tabs if specified
    ...Array.from(groups).map((groupName, index) => {
      const id = uuidv4();
      containerIds.set(groupName, id);
      // Find the first property that uses this group to get its tab
      const prop = properties.find(p => p.group === groupName);
      return {
        id,
        name: groupName,
        type: "Group" as const,
        parent: prop?.tab ? { id: containerIds.get(prop.tab)! } : null,
        sortOrder: index
      };
    })
  ];

  return { containers, containerIds };
} 