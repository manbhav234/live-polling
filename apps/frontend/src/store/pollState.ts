import {create} from 'zustand';
import { useSocketState } from './socketState';
import { type User } from './userState';

export type Option = {
    title: string, 
    count: number
}

export interface Poll {
    pollId: string, 
    adminToken: string, 
    question: string,
    options: Option[],
    participants: User[],
    isActive: boolean,
    createPollCallback: ((adminToken: string) => void) | null,
    joinPollCallback: (() => void) | null,
    
    createPoll: (question: string, options: {title: string}[], createPollCallback: (adminToken: string) => void) => void,
    joinPoll: (pollId: string, userId: string, onSuccess: () => void) => void,
    setPollDetails: (pollId:string, question: string, options: {title: string}[]) => void,
    setPollCredentials: (pollId: string, adminToken: string) => void,
    getAdminToken: () => string,
    getPollDetails: () => ({pollId:string, question: string, options: Option[], isActive: boolean})

}


export const usePollState = create<Poll>((set, get) => ({
    pollId: "",
    adminToken: "",
    question: "",
    options: [],
    participants: [],
    isActive: false,
    createPollCallback: null,
    joinPollCallback: null,
    setPollCredentials: (pollId: string, adminToken: string) => set({pollId: pollId, adminToken: adminToken}),
    setPollDetails: (pollId: string, question: string, options: {title: string}[]) => set({pollId: pollId, question: question, options: options.map((option) => ({...option, count: 0}))}),
    getAdminToken: () => get().adminToken,

    createPoll: (question: string, options: {title: string}[], onSuccess: (adminToken: string) => void) => {
        console.log("reached inside create poll")
        set({createPollCallback: onSuccess});
        const isConnected = useSocketState.getState().isConnected;
        if (isConnected){
            console.log("sending data on create");
            const createData = {
                type: "create",
                payload: {
                    question: question,
                    options: options
                }
            }
            useSocketState.getState().socket?.send(JSON.stringify(createData));
        }
        return;
    },

    joinPoll: (pollId: string, userId: string, onSuccess: () => void) => {
        set({joinPollCallback: onSuccess});
        const isConnected = useSocketState.getState().isConnected;
        if (isConnected){
            console.log("joining a poll: sending join message");
            const createData = {
                type: "join",
                payload: {
                    pollId: pollId,
                    id: userId
                }
            }
            useSocketState.getState().socket?.send(JSON.stringify(createData));
        }
        return;
    },
    getPollDetails: () => ({pollId: get().pollId, question: get().question, options: get().options, isActive: get().isActive})

}))