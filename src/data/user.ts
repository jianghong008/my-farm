import { createContext } from "react";

export const UserContext = createContext<{
    data:UserData,
    setData:(u:UserData) => void
}>({
    data: initUser(),
    setData: () => {}
});

export function initUser():UserData {
    return {
        isConnect: false,
        address:'',
        user: {
            createTime: 0,
            cow: {
                cow: '0',
                cowClaimTime: 0,
                cowClaim: '0',
                cowFeedingTime: 0,
                cowStore: '0',
                cowConsume: '0',
                cowClaimLatest: '0'
            },
            tree: {
                tree: '0',
                treeClaimTime: 0,
                treeClaim: '0',
                treeFeedingTime: 0,
                treeStore: '0',
                treeConsume: '0',
                treeClaimLatest: '0'
            }
        },
        init: false,
        consumes: {
            cow: '0',
            tree: '0'
        }
    }
}

export async function connect(){

}