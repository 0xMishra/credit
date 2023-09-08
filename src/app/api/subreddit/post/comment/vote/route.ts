import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { CommentVoteValidator } from '@/lib/validators/vote'
import { ZodError } from 'zod'

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { voteType, commentId } = CommentVoteValidator.parse(body)

    const session = await getAuthSession()

    if (!session?.user) return new Response('Unauthorized', { status: 401 })

    const existingVote = await db.commentVote.findFirst({
      where: {
        userId: session.user.id,
        commentId,
      },
    })

    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.commentVote.delete({
          where: {
            userId_commentId: {
              commentId,
              userId: session.user.id,
            },
          },
        })
        return new Response('OK')
      } else {
        await db.commentVote.update({
          where: {
            userId_commentId: {
              commentId,
              userId: session.user.id,
            },
          },
          data: {
            type: voteType,
          },
        })
      }
      return new Response('OK')
    }

    await db.commentVote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        commentId,
      },
    })

    return new Response('OK')
  } catch (error) {
    if (error instanceof ZodError)
      return new Response('invalid post request data passed', { status: 422 })

    return new Response('could not register your vote, please try again', {
      status: 500,
    })
  }
}
