import { Button } from "./ui/button";
import {type Option} from "@repo/types"
export default function DisplayChart({options, isAdmin, isActive}: {options: Option[], isAdmin: boolean, isActive: boolean}) {

    return (
        <div className="w-2/3 mx-auto h-[70%] grid grid-cols-3 justify-center items-center border-2 border-red-500">
            {options.map((option) => (
                <div className="flex justify-center items-center gap-4" key={option.title}>
                    <span className="text-white font-bold text-xl md:text-3xl">{option.title}</span>
                    <span className="text-white font-bold text-xl md:text-3xl">{option.count}</span>
                    {!isAdmin && <Button disabled={!isActive}>Vote</Button>}
                </div>    
            ))}
        </div>
    )
}