import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { ZodError, z } from 'zod'

export const GET = async (req: Request) => {
  const url = new URL(req.url)

  const session = await getAuthSession()

  let followedCommunitiesIds: string[] = []

  if (session) {
    const followedCommunities = await db.subscription.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        subreddit: true,
      },
    })

    followedCommunitiesIds = followedCommunities.map(
      ({ subreddit }) => subreddit.id,
    )
  }

  try {
    const { limit, page, subredditName } = z
      .object({
        limit: z.string(),
        page: z.string(),
        subredditName: z.string().nullish().optional(),
      })
      .parse({
        subredditName: url.searchParams.get('subredditName'),
        limit: url.searchParams.get('limit'),
        page: url.searchParams.get('page'),
      })

    let whereClause = {}

    if (subredditName) {
      whereClause = {
        subreddit: {
          name: subredditName,
        },
      }
    } else if (session) {
      whereClause = {
        subreddit: {
          id: {
            in: followedCommunitiesIds,
          },
        },
      }
    }

    const posts = await db.post.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        subreddit: true,
        votes: true,
        comments: true,
        author: true,
      },
      where: whereClause,
    })
    return new Response(JSON.stringify(posts))
  } catch (error) {
    if (error instanceof ZodError)
      return new Response('invalid request data passed', { status: 422 })

    return new Response('could not fetch new posts', { status: 500 })
  }
}
