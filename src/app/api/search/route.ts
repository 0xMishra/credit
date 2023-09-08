import { db } from '@/lib/db'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = url.searchParams.get('q')
  if (!q) return new Response('invalid query', { status: 400 })
  console.log(q)
  const results = await db.subreddit.findMany({
    where: {
      name: {
        startsWith: q,
      },
    },
    include: {
      _count: true,
    },
    take: 5,
  })
  console.log(results)
  return new Response(JSON.stringify(results))
}
