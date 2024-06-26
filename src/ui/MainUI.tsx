import { useState } from "react"
import { UserContext, initUser } from "../data/user"
import { Connect } from "./Connect"
import { RightInfo } from "./right/RIghtInfo"
export function MainUI() {
    const [data, setData] = useState<UserData>(initUser())

    return <UserContext.Provider value={{ data, setData }}>
        <div onClick={e => e.stopPropagation()}>
            {
                !data.user.createTime && <Connect />
            }
            {
                data.user.createTime && <>
                    <RightInfo />
                </>
            }
        </div>

    </UserContext.Provider>
}