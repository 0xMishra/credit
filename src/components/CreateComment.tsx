'use client'
import React, { useState } from 'react'
import { Label } from './ui/Label'
import { Textarea } from './ui/Textarea'
import { Button } from './ui/Button'
import { useMutation } from '@tanstack/react-query'
import { CommentRequest } from '@/lib/validators/comment'
import axios from 'axios'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface CreateCommentProps {
  postId: string
  replyToId?: string
}

const CreateComment = ({ postId, replyToId }: CreateCommentProps) => {
  const router = useRouter()
  const [input, setInput] = useState<string>('')
  const { mutate: postComment, isLoading } = useMutation({
    mutationFn: async ({ text, replyToId, postId }: CommentRequest) => {
      const payload: CommentRequest = {
        postId,
        replyToId,
        text,
      }

      const { data } = await axios.patch('/api/subreddit/post/comment', payload)
      return data
    },
    onError: () => {
      return toast({
        title: 'Something went wrong.',
        description: "Comment wasn't created successfully. Please try again.",
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      router.refresh()
      setInput('')
    },
  })

  return (
    <div className='grid w-full gap-1.5'>
      <Label htmlFor='comment'>Your comment</Label>
      <div className='mt-2'>
        <Textarea
          id='comment'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={1}
          placeholder='What are your thoughts'
        />
        <div className='mt-2 flex justify-end'>
          <Button
            onClick={() => {
              postComment({
                postId,
                text: input,
                replyToId,
              })
            }}
            isLoading={isLoading}
            disabled={input.length === 0}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreateComment
