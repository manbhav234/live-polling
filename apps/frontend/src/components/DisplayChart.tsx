import { usePollState } from "@/store/pollState";
import { type adminDetails } from "@/queries/adminPollQuery";
import { type userDetails } from "@/queries/userPollQuery";
import { queryClient } from "@/lib/createQueryClient";
import { motion } from "motion/react";

type DisplayChartProps = {
  token: string;
  isAdmin: boolean;
  data: adminDetails | userDetails;
  hasVoted: boolean;
};

export default function DisplayChart({
  data,
  isAdmin,
  token,
  hasVoted,
}: DisplayChartProps) {
  const castVote = usePollState((state) => state.castVote);

  const totalVotes = data.options.reduce(
    (total, option) => total + option.count,
    0,
  );

  const handleVoteCast = (title: string) => {
    queryClient.setQueriesData(
      { queryKey: ["userPollQuery", data.pollId] },
      (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          options: data.options.map((option) =>
            option.title === title
              ? { title: option.title, count: option.count + 1 }
              : option,
          ),
        };
      },
    );
    castVote(data.pollId, token, title);
  };

  const colorVariants = {
    0: "bg-blue-500",
    1: "bg-green-500",
    2: "bg-red-300",
    3: "bg-yellow-500",
    4: "bg-pink-500"
  }
  console.log(data.isActive)
  return (
    <div className="h-[65%] w-full">
      <div className="flex items-center justify-center h-[85%] w-2/3 mx-auto gap-4">
        {data.options.map((option, index) => {
          // 2. Calculate relative height (default to 0 if no votes yet)
          const heightPercentage =
            totalVotes > 0 ? (option.count / totalVotes) * 100 + 5 : 5;

          return (
            <div
              key={option.title}
              className="flex flex-col items-center w-1/5 h-full justify-center py-2"
            >
              <div className="relative w-full flex flex-col justify-end h-full">
                {/* 3. The Animated Bar */}
                <motion.div
                  initial={{ height: 5 }}
                  animate={{ height: `${heightPercentage}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className={`${colorVariants[index as keyof typeof colorVariants]} rounded-t-md flex items-center justify-center overflow-hidden`}
                >
                  {/* 4. Text inside the bar */}
                  {
                    <span className="text-white text-xs md:text-2xl font-bold">
                      {option.count}
                    </span>
                  }
                </motion.div>
              </div>
              <div className="flex flex-col justify-around items-center gap-2 p-2 w-full">
                <span className="text-white text-xs md:text-xl font-bold text-center text-wrap">
                  {option.title}
                </span>
                {!isAdmin && !hasVoted && <button disabled={!data.isActive} onClick={() => handleVoteCast(option.title)} className="bg-white text-black text-xs md:text-lg font-bold rounded-lg px-3 py-1 hover:cursor-pointer hover:bg-gray-100">
                  Vote
                </button>}
              </div>
            </div>
          );
        })}
      </div>
      <div className="h-[15%] flex justify-center items-center">
        {hasVoted && <p className="text-center font-bold text-white text-2xl">Your Vote Has Been Casted</p>}
      </div>
    </div>
  );
}
