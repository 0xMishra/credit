import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { SubredditSubscriptionValidator } from '@/lib/validators/subreddit'
import { ZodError } from 'zod'

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) return new Response('Unauthorized', { status: 401 })

    const body = await req.json()

    const { subredditId } = SubredditSubscriptionValidator.parse(body)
    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId: subredditId,
        userId: session.user.id,
      },
    })

    if (!subscriptionExists)
      return new Response('You are not subscribed to this subreddit', {
        status: 400,
      })

    const subredditCreatedByUser = await db.subreddit.findFirst({
      where: {
        id: subredditId,
        creatorId: session.user.id,
      },
    })

    if (subredditCreatedByUser)
      return new Response('You cannot unsubscribe from your own subreddit', {
        status: 400,
      })

    await db.subscription.delete({
      where: {
        userId_subredditId: {
          subredditId: subredditId,
          userId: session.user.id,
        },
      },
    })

    return new Response(subredditId)
  } catch (error) {
    if (error instanceof ZodError)
      return new Response(error.message, { status: 422 })

    return new Response('Could not unsubscribe from this subreddit', {
      status: 500,
    })
  }
}
