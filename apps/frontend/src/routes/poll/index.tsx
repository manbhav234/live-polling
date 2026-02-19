import { createFileRoute, redirect} from '@tanstack/react-router'

export const Route = createFileRoute('/poll/')({
  loader: () => {
    throw redirect({to: '/'})
  }
})