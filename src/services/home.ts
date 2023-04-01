interface AppInfoInterface {
  name: string;
  version: string;
}

/**
 * Returns the application information.
 *
 * @returns {Promise<AppInfoInterface>}
 */
export async function getAppInfo(): Promise<AppInfoInterface> {
  return {
    name: process.env.npm_package_name || '',
    version: process.env.npm_package_version || ''
  };
}
