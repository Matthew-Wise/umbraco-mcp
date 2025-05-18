import { join } from 'path';

// Use absolute path from current working directory
export const RESOURCES_DIR = join(process.cwd(), 'build', 'resources').replace(/\\/g, '/');