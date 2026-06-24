'use server'

import { serverQuery } from "../core/server"

export const getDashboardStats = async() => {
    return serverQuery('/api/stats');
}