import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useSocketState } from '@/store/socketState'
export const Route = createFileRoute('/')({ component: App })

function App() {

  const socket = useSocketState((state) => state.socket);
  if (socket){
    socket.close();
  }

  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className='flex flex-col justify-center items-center gap-4'>
        <h1 className='text-white font-bold text-xl md:text-3xl text-center '>Welcome to Live Polling</h1>
        <div className='flex justify-center items-center gap-4'>
          <Button asChild>
            <Link to='/join'>Join Poll</Link>
          </Button>
          <Button asChild>
            <Link to='/create-poll'>Create Poll</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
