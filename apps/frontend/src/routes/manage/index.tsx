import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/manage/')({
  loader: () => {
    throw redirect({to: "/"});
  }
})