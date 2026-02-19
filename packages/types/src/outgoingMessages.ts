import {z} from 'zod'

export enum OutgoingMessageType {
    CREATED = "created",
    POLL_JOINED = "joined",
    POLL_STARTED = "started",
    INC_VOTE = "inc_vote",
}


export const CreatedMessage = z.object({
    pollId: z.string().length(6),
    adminToken: z.uuid(), 
    question: z.string(),
    options: z.array(z.object({title: z.string(), count: z.number()})),
    isActive: z.boolean()
})

export type CreatedMessageType = z.infer<typeof CreatedMessage>


export const PollJoinedMessage = z.object({
    isActive: z.boolean(),
    options: z.array(z.object({
        title: z.string(),
        count: z.number()
    })), 
    question: z.string(),
    pollId: z.string().length(6),
    userId: z.uuid()
})

export type PollJoinedMessageType = z.infer<typeof PollJoinedMessage>;

export const PollStartedMessage = z.object({
    pollId: z.string().length(6),
    isActive: z.boolean(), 
    options: z.array(z.object({title: z.string(), count: z.number()}))
})

export type PollStartedMessageType = z.infer<typeof PollStartedMessage>


export const IncrementVoteMessage = z.object({
    pollId: z.string().length(6),
    optionTitle: z.string(),
    currentStatus: z.array(z.object({title: z.string(), votes: z.number()}))
})

export type IncrementVoteMessageType = z.infer<typeof IncrementVoteMessage>


export type OutgoingMessage = {
    type: OutgoingMessageType.CREATED;
    payload: CreatedMessageType
}  | {
    type: OutgoingMessageType.POLL_JOINED;
    payload: PollJoinedMessageType
} | {
    type: OutgoingMessageType.POLL_STARTED;
    payload: PollStartedMessageType
}| {
    type: OutgoingMessageType.INC_VOTE;
    payload: IncrementVoteMessageType
}