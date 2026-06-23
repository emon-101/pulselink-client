'use server'

import { serverMutation } from "../core/server"

export const createDonationRequest = async(newDonationRequest) => {
    return serverMutation('/api/donation-request', newDonationRequest);
}