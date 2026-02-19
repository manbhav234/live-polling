import {create} from 'zustand';
import { useSocketState } from './socketState';

export type Option = {
    title: string, 
    count: number
}

export interface Poll {
    createPollCallback: ((adminToken: string, pollId: string) => void) | null,
    joinPollCallback: (() => void) | null,
    
    createPoll: (question: string, options: {title: string}[], createPollCallback: (adminToken: string, pollId: string) => void) => void,
    joinPoll: (pollId: string, userId: string, onSuccess: () => void) => void,
    startPoll: (pollId: string, adminToken: string) => void,
    castVote: (pollId: string, userId: string, option: string) => void

}


export const usePollState = create<Poll>((set) => ({
    createPollCallback: null,
    joinPollCallback: null,

    createPoll: (question: string, options: {title: string}[], onSuccess: (adminToken: string, pollId: string) => void) => {
        set({createPollCallback: onSuccess});
        const isConnected = useSocketState.getState().isConnected;
        if (isConnected){
            const createMessage = {
                type: "create",
                payload: {
                    question: question,
                    options: options
                }
            }
            useSocketState.getState().socket?.send(JSON.stringify(createMessage));
        }
        return;
    },

    joinPoll: (pollId: string, userId: string, onSuccess: () => void) => {
        set({joinPollCallback: onSuccess});
        const isConnected = useSocketState.getState().isConnected;
        if (isConnected){
            const createMessage = {
                type: "join",
                payload: {
                    pollId: pollId,
                    id: userId
                }
            }
            useSocketState.getState().socket?.send(JSON.stringify(createMessage));
        }
        return;
    },

    startPoll: (pollId: string, adminToken: string) => {
        const isConnected = useSocketState.getState().isConnected;
        if (isConnected){
            const createMessage = {
                type: "start",
                payload: {
                    pollId: pollId,
                    adminToken: adminToken
                }
            }
            useSocketState.getState().socket?.send(JSON.stringify(createMessage));
        }
        
    },

    castVote: (pollId: string, userId: string, option: string) => {
        const isConnected = useSocketState.getState().isConnected;
        if (isConnected){
            const createMessage = {
                type: "vote",
                payload: {
                    pollId: pollId,
                    userId: userId,
                    option: option
                }
            }
            useSocketState.getState().socket?.send(JSON.stringify(createMessage));
        }
    }

}))