import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { PostValidator } from '@/lib/validators/post'
import { ZodError } from 'zod'

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) return new Response('Unauthorized', { status: 401 })

    const body = await req.json()

    const { subredditId, title, content } = PostValidator.parse(body)

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId: subredditId,
        userId: session.user.id,
      },
    })

    if (!subscriptionExists)
      return new Response('You have to subscribe to this subreddit to post', {
        status: 400,
      })

    await db.post.create({
      data: {
        subredditId,
        title,
        content,
        authorId: session.user.id,
      },
    })

    return new Response('post created')
  } catch (error) {
    if (error instanceof ZodError)
      return new Response(error.message, { status: 422 })

    return new Response(
      'Could not post to this subreddit at this moment, please try again after some time',
      {
        status: 500,
      },
    )
  }
}
