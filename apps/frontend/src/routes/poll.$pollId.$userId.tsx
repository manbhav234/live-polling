import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { checkUserAndPollStatus } from '@/actions/checkUserAndPollStatus.functions';
import { toast } from 'sonner';
import PollHeader from '@/components/PollHeader';
import DisplayChart from '@/components/DisplayChart';
import { usePollState } from '@/store/pollState';
export const Route = createFileRoute('/poll/$pollId/$userId')({
  loader: async ({params}) => {
    const response = await checkUserAndPollStatus({data: {pollId: params.pollId, userId: params.userId}})
    if (response.success){
      return response.responseData;
    }
    toast.error(response.message, {position: 'top-center'})
    redirect({to: '/'});
  },
  component: RouteComponent,
  errorComponent: RouteErrorComponent
})

function RouteErrorComponent(){
  const navigate = useNavigate();
  //TODO: show an invalid user id toast error
  navigate({to: '/'})
  return (
    <></>
  )
}

function RouteComponent() {
  const data = Route.useLoaderData();
  const setPollDetails = usePollState((state) => state.setPollDetails);
  setPollDetails(data!.pollId, data?.question, data!.options);

  return (
    <div className='w-full h-full'>
      <PollHeader/>
      <DisplayChart/>
    </div>
  )
}
