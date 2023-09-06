import { getAuthSession } from '@/lib/auth'
import { ZodError } from 'zod'

export async function PATCH(req: Request) {
  try {
    const body = await req.json()

    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }
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
