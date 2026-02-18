import { usePollState } from "@/store/pollState"

export default function PollHeader() {

    const getPollDetails = usePollState((state) => state.getPollDetails);
    const pollDetails = getPollDetails();

    return (
        <div className='h-[20%] w-full flex flex-col justify-center items-center'>
            <h1 className='text-center text-xl md:text-4xl text-white font-bold'>Poll: {pollDetails.pollId}</h1>
            <p className='text-white mt-8 text-xl md:text-4xl text-center font-bold'>Question: {pollDetails.question}</p>
        </div>
    )
}