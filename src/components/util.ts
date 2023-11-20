export const toSnakeCase = (str: string): string => {
  return (
    str
      // Replace spaces and dashes with underscores
      .replace(/[\s-]+/g, "_")
      // Insert underscores before capital letters (for camelCase) and lowercase them
      .replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`)
      // Remove leading and trailing underscores that might have been added
      .replace(/^_+|_+$/g, "")
      // Ensure it doesn't start with a number
      .replace(/^(\d)/, "_$1")
  );
};
