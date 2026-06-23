'use server'

import { serverMutation, serverQuery } from "../core/server"

export const createDonationRequest = async(newDonationRequest) => {
    return serverMutation('/api/donation-request', newDonationRequest);
}

export const getMyDonationRequests = async(requesterId) => {
    if(!requesterId) return [];
    return serverQuery('/api/donation-request', { requesterId });
}