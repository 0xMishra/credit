import { Icons } from './Icons'

const SignIn = () => {
  return (
    <div className='container mx-auto flex flex-col w-full justify-center space-y-6 sm:w-[400px]'>
      <div className='flex flex-col space-y-2 text-center'>
        <Icons.logo className='mx-auto h-6 w-6' />
        <h1 className='text-zxl font-semibold tracking-tight '>Welcome Back</h1>
        <p className=' text-sm max-w-xs mx-auto'>
          By continuing you are setting up a Credit account and agree to our
          User agreement and Privacy Policy
        </p>

        {/* sign in form */}
      </div>
    </div>
  )
}

export default SignIn
