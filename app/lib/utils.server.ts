function getEnvVariable(key: string) {
  const vars = process.env;

  return vars?.[key];
}

export function getOptionalEnvVariable(key: string, defaultValue?: string) {
  return getEnvVariable(key) ?? defaultValue;
}

export function getRequiredEnvVariable(key: string) {
  const value = getEnvVariable(key);
  if (value !== undefined) {
    return value;
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`${key} is a required env variable`);
  }

  console.log(`${key} is a required env variable and it's undefined`);
  return `${key}-is-undefined`;
}

/**
 * @returns domain URL (without a ending slash, like: https://domain.com)
 * throws on failure ??
 */
export function getDomainUrlFromRequest(request: Request) {
  const host =
    request.headers.get('X-Forwarded-Host') ?? request.headers.get('host');

  if (!host) {
    // throw new Error('Could not determine domain URL.');
    return null;
  }

  const protocol = host.includes('localhost') ? 'http' : 'https';

  return `${protocol}://${host}`;
}
