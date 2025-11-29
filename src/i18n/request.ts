/* eslint-disable unicorn/no-await-expression-member */

import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'

/**
 * This function retrieves the locale from a cookie and loads the corresponding
 * messages file. It is used to configure internationalization settings for the
 * application.
 *
 * @returns An object containing the locale and messages for that locale.
 */
export default getRequestConfig(async () => {
  let locale = 'en'

  try {
    const cookieStore = await cookies()
    const localeCookie = cookieStore.get('locale')
    locale = localeCookie?.value || 'en'
  } catch {
    // Fallback to 'en' if cookies() fails in Edge Runtime
    locale = 'en'
  }

  // Validate locale
  const validLocales = ['en', 'pt', 'ro'] as const
  if (!validLocales.includes(locale as (typeof validLocales)[number])) {
    locale = 'en'
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  }
})
