export type Participant = {
    userId: string,
    hasVoted: boolean
};

export type Option = {
    title: string, 
    count: number
}

export type Poll = {
    adminToken: string
    question: string, 
    options: Option[],
    isActive: boolean
}

export type PollDetails = {
    pollId: string,
    question: string,
    options: {title: string, count: number}[],
    isActive: boolean
}