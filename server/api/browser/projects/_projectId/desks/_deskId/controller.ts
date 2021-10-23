import { createWork } from '$/service/browser'
import type { DeskId } from '$/types'
import { defineController } from './$relay'

export default defineController(() => ({
  post: async ({ params, body }) => {
    const work = await createWork(params.deskId as DeskId, body.path, body.name, body.ext)
    return work ? { status: 200, body: work } : { status: 404 }
  },
}))
