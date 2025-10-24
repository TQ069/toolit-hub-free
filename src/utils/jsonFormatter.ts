export interface JsonFormatResult {
  success: boolean;
  formatted?: string;
  error?: string;
}

export function formatJson(input: string, minify: boolean = false): JsonFormatResult {
  try {
    const parsed = JSON.parse(input);
    const formatted = minify ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2);
    return { success: true, formatted };
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Invalid JSON format';
    return { success: false, error };
  }
}

export function validateJson(input: string): boolean {
  try {
    JSON.parse(input);
    return true;
  } catch {
    return false;
  }
}
