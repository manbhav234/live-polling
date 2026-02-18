import {create} from 'zustand';


export interface User {
    userId: string,
    hasVoted: boolean,
    voteOption?: string,
    getUser: () => ({userId: string, hasVoted: boolean, voteOption?: string});
    setUser: (userId: string) => void;
}


export const useUserState = create<User>((set, get) => ({
    userId: "",
    hasVoted: false,
    voteOption: "",
    getUser: () => ({userId: get().userId, hasVoted: get().hasVoted, voteOption: get().voteOption}),
    setUser: (userId: string) => set({userId: userId}),
}))