import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { CommentValidator } from '@/lib/validators/comment'
import { ZodError } from 'zod'

export async function PATCH(req: Request) {
  try {
    const body = await req.json()

    const { text, postId, replyToId } = CommentValidator.parse(body)

    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    await db.comment.create({
      data: {
        postId,
        text,
        replyToId,
        authorId: session.user.id,
      },
    })
    return new Response('OK')
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
