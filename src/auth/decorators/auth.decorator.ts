import { SetMetadata } from '@nestjs/common'
import { AuthOptions } from 'src/utils/interfaces'

export const Auth = (options?: AuthOptions) => {
  const metadata: AuthOptions = {
    isLive: options.isLive ?? true,
    isOpen: options.isOpen ?? true,
  }
  return SetMetadata('authOptions', metadata)
}
