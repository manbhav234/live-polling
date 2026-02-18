import { usePollState } from "@/store/pollState"
import { Button } from "./ui/button";
export default function DisplayChart() {

    const getPollDetails = usePollState((state) => state.getPollDetails);
    const getAdminToken = usePollState((state) => state.getAdminToken)
    const adminToken = getAdminToken();
    const pollDetails = getPollDetails();

    return (
        <div className="w-2/3 mx-auto h-[70%] grid grid-cols-3 justify-center items-center border-2 border-red-500">
            {pollDetails.options.map((option) => (
                <div className="flex justify-center items-center gap-4" key={option.title}>
                    <span className="text-white font-bold text-xl md:text-3xl">{option.title}</span>
                    <span className="text-white font-bold text-xl md:text-3xl">{option.count}</span>
                    {!pollDetails.isActive && !adminToken && <Button disabled={!pollDetails.isActive}>Vote</Button>}
                </div>    
            ))}
        </div>
    )
}