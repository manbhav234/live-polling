import {z} from 'zod'

export enum OutgoingMessageType {
    CREATED = "created",
    POLL_JOINED = "joined",
    POLL_STARTED = "started",
    VOTE_CASTED = "vote_casted",
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

export const VoteCasted = z.object({
    pollId: z.string().length(6),
    userId: z.uuid(),
    hasVoted: z.boolean()
})
export type VoteCasted = z.infer<typeof VoteCasted>

export const VotesMessage = z.object({
    pollId: z.string().length(6),
    options: z.array(z.object({title: z.string(), count: z.number()}))
})

export type VotesMessageType = z.infer<typeof VotesMessage>


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
    payload: VotesMessageType
} | {
    type: OutgoingMessageType.VOTE_CASTED;
    payload: VoteCasted
}