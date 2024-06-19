type Filter = Record<string, string[]>;

const filterToString = (filters: Filter) => {
  const parts = [];
  for (const [key, values] of Object.entries(filters)) {
    parts.push(`${key}:${values.join(',')}`);
  }
  return parts.join(';');
};

const filterFromString = (str: string) => {
  str = decodeURIComponent(str.trim());
  const parts = str.split(';');
  const entries: [string, string[]][] = [];
  for (const part of parts) {
    const [key, valueString] = part.split(':');
    if (!key || !valueString) {
      continue;
    }
    const values = valueString.split(',').filter((v) => v);
    entries.push([key, values]);
  }
  return Object.fromEntries(entries);
};

export { filterToString, filterFromString };
