import { headers } from "next/headers"
import { auth } from "../auth"

export const getUserSession = async() => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    return session?.user || null;
}

export const getAuthToken = async() => {
    try{
        const result = await auth.api.getToken({
            headers: await headers()
        });
        return result?.token || null;
    } catch {
        return null;
    }
}
