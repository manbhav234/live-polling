import { Button } from '@/components/ui/button'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Field, FieldLabel } from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { handleUserJoinFn } from '@/actions/handleUserJoinFn.functions'
import { toast } from 'sonner'
import { useSocketState } from '@/store/socketState'
import { usePollState } from '@/store/pollState'
import { useUserState } from '@/store/userState'

export const Route = createFileRoute('/join')({ component: JoinComponent })


function JoinComponent() {
    const socket = useSocketState((state) => state.socket);
    useEffect(() => {   
        if (socket){
            socket.close();
        }
    }, [])

    const connect = useSocketState((state) => state.connect);
    const joinPoll = usePollState((state) => state.joinPoll);
    const setUser = useUserState((state) => state.setUser);
    const [userPollId, setUserPollId] = useState<string>("");
    const navigate = useNavigate();

    const handleUserJoin = async () => {
        const response = await handleUserJoinFn({data: {pollId: userPollId}});
        if (!response.isExisting){
            toast.error(`Poll with Id ${userPollId} does not exist`, {position: 'top-center'});
            return;
        }
        await connect();
        joinPoll(userPollId, response.userId!, () => {
            setUser(userPollId);
            navigate({to: '/poll/$pollId/$userId', params: {pollId: userPollId, userId: response.userId!}})
        })
    }

    return (
        <div className='w-full h-full flex justify-center items-center'>
            <div className='flex flex-col justify-center items-center gap-6'>
                <Field className="w-fit">
                <FieldLabel htmlFor="digits-only" className='text-lg'>Enter Poll Id</FieldLabel>
                <InputOTP id="digits-only" maxLength={6} pattern={REGEXP_ONLY_DIGITS} onChange={(value) => setUserPollId(value)}>
                    <InputOTPGroup className='*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl'>
                    <InputOTPSlot index={0}/>
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
                </Field>
                <Button className='w-full. hover:cursor-pointer' onClick={handleUserJoin}>Join Poll</Button>
            </div>
            
        </div>
    )
}
