import { createFileRoute,redirect } from '@tanstack/react-router'
import { usePollState } from '@/store/pollState';
import { Button } from '@/components/ui/button';
import DisplayChart from '@/components/DisplayChart';
import PollHeader from '@/components/PollHeader';
import { queryClient } from '@/lib/createQueryClient';
import { useSuspenseQuery } from '@tanstack/react-query';
import adminPollQuery from '@/queries/adminPollQuery';

export const Route = createFileRoute('/manage/$pollId/$adminToken')({
  loader: async ({params}) => {
    try {
      await queryClient.ensureQueryData(adminPollQuery(params.pollId, params.adminToken))  
    } catch (e){
      console.log(e);
      throw redirect({to: '/'})
    }
      
},
  component: RouteComponent,
})


function RouteComponent() {
  const params = Route.useParams();
  const startPoll = usePollState((state) => state.startPoll);
  const {data} = useSuspenseQuery(adminPollQuery(params.pollId, params.adminToken));
  console.log(data);
  const handlePollStart = () => {
    startPoll(params.pollId, params.adminToken);
  }


  return (
  <div className='w-full h-full'>
    <PollHeader pollId={data.pollId} question={data.question}/>
    <DisplayChart isAdmin={true} isActive={data.isActive} options={data.options}/>
    <div className='flex justify-center items-center h-[10%] mx-auto gap-12'>
      {!data.isActive && <Button className='hover:cursor-pointer' onClick={handlePollStart}>
        Start Poll
      </Button>}
      {data.isActive &&  <Button className='hover:cursor-pointer'>
        End Poll
      </Button>}
    </div>
  </div>
  )
}
