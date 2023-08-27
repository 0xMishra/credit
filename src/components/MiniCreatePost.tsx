'use client'

import { Session } from 'next-auth'
import { usePathname, useRouter } from 'next/navigation'
import { UserAvatar } from './UserAvatar'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { ImageIcon, Link2 } from 'lucide-react'

interface MiniCreatePostProps {
  session: Session | null
}

export const MiniCreatePost = ({ session }: MiniCreatePostProps) => {
  const router = useRouter()
  const pathName = usePathname()

  return (
    <li className='overflow-hidden rounded-md bg-white shadow'>
      <div className='h-full px-6 py-4 flex justify-between gap-6'>
        <div className='relative'>
          <UserAvatar
            user={{
              name: session?.user.name || null,
              image: session?.user.image || null,
            }}
          />
          <span className='absolute bottom-7   right-0 rounded-full w-3 h-3 bg-green-500 outline outline-2 outline-white'></span>
        </div>

        <Input
          readOnly
          onClick={() => router.push(pathName + '/submit')}
          placeholder='Create post'
        />
        <Button
          onClick={() => router.push(pathName + '/submit')}
          variant={'ghost'}
        >
          <ImageIcon className='text-zinc-600' />
        </Button>
        <Button
          onClick={() => router.push(pathName + '/submit')}
          variant={'ghost'}
        >
          <Link2 className='text-zinc-600' />{' '}
        </Button>
      </div>
    </li>
  )
}
