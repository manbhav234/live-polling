import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { checkAdminTokenFn } from '@/actions/checkAdminTokenFn.functions';
import { toast } from 'sonner';
import { usePollState } from '@/store/pollState';
import { Button } from '@/components/ui/button';
import DisplayChart from '@/components/DisplayChart';
import PollHeader from '@/components/PollHeader';

export const Route = createFileRoute('/manage/$adminToken')({
  loader: async ({params}) => {
    console.log("reached inside router loader manage/adminToken");
    const response = await checkAdminTokenFn({data: {adminToken: params.adminToken}});
    if (response.success){
        console.log("response successful");
        return response.responseData
    }
    toast.error(response.message, {position: 'top-center'});
    redirect({to: '/'});
},
  component: RouteComponent,
  errorComponent: RouteErrorComponent
})

export type PollDetails = {
    pollId: string,
    adminToken: string, 
    question: string,
    options: {title: string}[],
    participants?: [] //TODO: see what to do with participants
}

function RouteErrorComponent(){
  const navigate = useNavigate();
  //TODO: show an invalid user id toast error
  navigate({to: '/'})
  return (
    <></>
  )
}


function RouteComponent() {

  const pollData: PollDetails = Route.useLoaderData();
  console.log(pollData);
  const setPollDetails = usePollState((state) => state.setPollDetails);
  setPollDetails(pollData.pollId, pollData.question, pollData.options);

  return (
  <div className='w-full h-full'>
    <PollHeader/>
    <DisplayChart/>
    <div className='flex justify-center items-center h-[10%] mx-auto gap-12'>
      <Button className='hover:cursor-pointer'>
        Start Poll
      </Button>
      <Button className='hover:cursor-pointer'>
        End Poll
      </Button>
    </div>
  </div>
  )
}
