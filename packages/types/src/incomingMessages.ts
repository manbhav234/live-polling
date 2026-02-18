import {z} from 'zod'

export enum IncomingMessageType {
    CREATE = "create",
    JOIN = "join",
    VOTE = "vote",
    FIND_POLL = "find_poll",
    START_POLL = "start"
}


export const CreateMessage = z.object({
  question: z.string().max(100),
  options: z
    .array(
      z.object({
        title: z.string().max(20),
      })
    )
    .min(2, "Add at least two options.")
    .max(5, "You can add up to 5 options."),
})

export type CreateMessageType = z.infer<typeof CreateMessage>

export const JoinMessage = z.object({
    id: z.uuid(),
    pollId: z.string().length(6)
})

export type JoinMessageType = z.infer<typeof JoinMessage>

export const VoteMessage = z.object({
    id: z.uuid(),
    pollId: z.string().length(6),
    vote: z.string()
})

export type VoteMessageType = z.infer<typeof VoteMessage>

export const FindPollMessage = z.object({
    pollId: z.string().length(6),
})

export type FindPollMessageType = z.infer<typeof FindPollMessage>

export const StartPollMessage = z.object({
    adminToken: z.uuid(), 
    pollId: z.string().length(6)
})

export type StartPollMessageType = z.infer<typeof StartPollMessage>


export type IncomingMessage = {
    type: IncomingMessageType.CREATE;
    payload: CreateMessageType
} | {
    type: IncomingMessageType.JOIN;
    payload: JoinMessageType
} | {
    type: IncomingMessageType.VOTE;
    payload: VoteMessageType
} | {
    type: IncomingMessageType.FIND_POLL;
    payload: {
        pollId: string
    }
} | {
    type: IncomingMessageType.START_POLL
    payload: StartPollMessageType
}