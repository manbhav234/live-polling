import {z} from 'zod'

export enum OutgoingMessageType {
    CREATED = "created",
    NEW_VOTER = "new_voter",
    INC_VOTE = "inc_vote",
    POLL_JOINED = "joined",
}


export const CreatedMessage = z.object({
    pollId: z.string().length(6),
    adminToken: z.uuid()
})

export type CreatedMessageType = z.infer<typeof CreatedMessage>

export const IncrementVoteMessage = z.object({
    pollId: z.string().length(6),
    optionTitle: z.string(),
    currentStatus: z.array(z.object({title: z.string(), votes: z.number()}))
})

export type IncrementVoteMessageType = z.infer<typeof IncrementVoteMessage>

export const PollJoinedMessage = z.object({
    isActive: z.boolean(),
    options: z.array(z.object({
        title: z.string(),
        count: z.number()
    })).optional()
})

export type PollJoinedMessageType = z.infer<typeof PollJoinedMessage>;


export type OutgoingMessage = {
    type: OutgoingMessageType.CREATED;
    payload: CreatedMessageType
} | {
    type: OutgoingMessageType.INC_VOTE;
    payload: IncrementVoteMessageType
} | {
    type: OutgoingMessageType.POLL_JOINED;
    payload: PollJoinedMessageType
}