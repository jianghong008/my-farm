interface Cow {
    cow: string
    cowClaimTime: number
    cowClaim: string
    cowFeedingTime: number
    cowStore: string
    cowConsume: string
    cowClaimLatest: string
}

interface Tree {
    tree: string
    treeClaimTime: number
    treeClaim: string
    treeFeedingTime: number
    treeStore: string
    treeConsume: string
    treeClaimLatest: string
}

interface User {
    createTime: number
    cow: Cow
    tree: Tree
}

interface UserData {
    isConnect: boolean
    address: string
    user: User
    init: boolean
}