'use client'
import { useMutation } from '@tanstack/react-query'
import { Button } from './ui/Button'
import { SubscribeToSubredditPayload } from '@/lib/validators/subreddit'
import axios, { AxiosError } from 'axios'
import { toast } from '@/hooks/use-toast'
import { useCustomToast } from '@/hooks/use-custom-toast'
import { useRouter } from 'next/navigation'
import { startTransition } from 'react'

interface SubscribeLeaveToggleProps {
  subredditId: string
  subredditName: string
  isSubscribed: boolean
}
export default function SubscribeLeaveToggle({
  subredditId,
  isSubscribed,
  subredditName,
}: SubscribeLeaveToggleProps) {
  const { loginToast } = useCustomToast()
  const router = useRouter()

  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId: subredditId,
      }
      const { data } = await axios.post('/api/subreddit/subscribe', payload)
      return data as string
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }
        toast({
          title: 'There was an error',
          description: 'Could not subscribe to the subreddit',
          variant: 'destructive',
        })
      }
    },
    onSuccess: (data) => {
      startTransition(() => {
        router.refresh()
      })
      return toast({
        title: 'Subscribed',
        description: `You are subscribed to r/${subredditName}`,
      })
    },
  })

  const { mutate: unsubscribe, isLoading: isUnsubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId: subredditId,
      }
      const { data } = await axios.post('/api/subreddit/unsubscribe', payload)
      return data as string
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }
        toast({
          title: 'There was an error',
          description: 'Could not unsubscribe from this subreddit',
          variant: 'destructive',
        })
      }
    },
    onSuccess: (data) => {
      startTransition(() => {
        router.refresh()
      })
      return toast({
        title: 'Unsubscribed',
        description: `You are unsubscribed from r/${subredditName}`,
      })
    },
  })
  return isSubscribed ? (
    <Button
      className='w-full mt-1 mb-4'
      onClick={() => unsubscribe()}
      isLoading={isUnsubLoading}
    >
      Leave community
    </Button>
  ) : (
    <Button
      className='w-full mt-1 mb-4'
      onClick={() => subscribe()}
      isLoading={isSubLoading}
    >
      Join to post
    </Button>
  )
}
