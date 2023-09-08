import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { PostVoteValidator } from '@/lib/validators/vote'
import { ZodError } from 'zod'

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { voteType, postId } = PostVoteValidator.parse(body)

    const session = await getAuthSession()

    if (!session?.user) return new Response('Unauthorized', { status: 401 })

    const existingVote = await db.vote.findFirst({
      where: {
        userId: session.user.id,
        postId,
      },
    })

    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
        votes: true,
      },
    })

    if (!post) return new Response('Post not found', { status: 404 })

    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.vote.delete({
          where: {
            userId_postId: {
              postId,
              userId: session.user.id,
            },
          },
        })
        return new Response('OK')
      }
      await db.vote.update({
        where: {
          userId_postId: {
            postId,
            userId: session.user.id,
          },
        },
        data: {
          type: voteType,
        },
      })

      return new Response('OK')
    }

    await db.vote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        postId,
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
