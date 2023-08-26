import Link from 'next/link'
import { toast } from './use-toast'
import { buttonVariants } from '@/components/ui/Button'

export function useCustomToast() {
  const loginToast = () => {
    const { dismiss } = toast({
      title: 'Login required',
      description: 'You need to be logged in to perform this action',
      variant: 'destructive',
      action: (
        <Link
          className={buttonVariants({ variant: 'outline' })}
          href={'/sign-in'}
          onClick={() => dismiss()}
        >
          Login
        </Link>
      ),
    })
  }
  return { loginToast }
}
