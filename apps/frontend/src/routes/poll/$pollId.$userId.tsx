import { createFileRoute, redirect } from '@tanstack/react-router'
import PollHeader from '@/components/PollHeader';
import DisplayChart from '@/components/DisplayChart';
import { queryClient } from '@/lib/createQueryClient';
import { useSuspenseQuery } from '@tanstack/react-query';
import userPollQuery from '@/queries/userPollQuery';
export const Route = createFileRoute('/poll/$pollId/$userId')({
  loader: async ({params}) => {
    try {
        await queryClient.ensureQueryData(userPollQuery(params.pollId, params.userId))
    } catch(e){
        console.log(e);
        throw redirect({to: '/'})
    }
    
  },
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useParams();
  const {data} = useSuspenseQuery(userPollQuery(params.pollId, params.userId));
  console.log(data);
  return (
    <div className='w-full h-full'>
    <PollHeader pollId={data.pollId} question={data.question}/>
    <DisplayChart isAdmin={false} isActive={data.isActive} options={data.options}/>
    </div>
  )
}
