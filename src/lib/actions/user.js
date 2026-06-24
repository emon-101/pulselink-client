'use server'

import { serverMutation, serverQuery } from "../core/server"

export const getAllUsers = async(status) => {
    return serverQuery('/api/users', status ? { status } : {});
}

export const updateUserById = async(id, updates) => {
    return serverMutation(`/api/users/${id}`, updates, 'PATCH');
}