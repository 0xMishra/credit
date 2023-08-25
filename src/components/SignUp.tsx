import Link from 'next/link'
import { Icons } from './Icons'
import UserAuthForm from './UserAuthForm'

const SignUp = () => {
  return (
    <div className='container mx-auto flex flex-col w-full justify-center space-y-6 sm:w-[400px]'>
      <div className='flex flex-col space-y-2 text-center'>
        <Icons.logo className='mx-auto h-6 w-6' />
        <h1 className='text-zxl font-semibold tracking-tight '>Sign up</h1>
        <p className=' text-sm max-w-xs mx-auto'>
          By continuing you are setting up a Credit account and agree to our
          User agreement and Privacy Policy
        </p>

        {/* sign in form */}
        <UserAuthForm />

        <p className='px-8 text-center text-sm text-zinc-700'>
          Already have an account ?{''}
          <Link
            className='hover:text-zinc-800 text-sm underline underline-offset-4'
            href={'/sign-in'}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp
