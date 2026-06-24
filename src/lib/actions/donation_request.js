'use server'

import { serverMutation, serverQuery } from "../core/server"

export const createDonationRequest = async(newDonationRequest) => {
    return serverMutation('/api/donation-request', newDonationRequest);
}

export const getAllDonationRequests = async() => {
    return serverQuery('/api/donation-request');
}

export const getMyDonationRequests = async(requesterId) => {
    if(!requesterId) return [];
    return serverQuery('/api/donation-request', { requesterId });
}

export const getDonationRequestById = async(id) => {
    if(!id) return null;
    return serverQuery(`/api/donation-request/${id}`);
}

export const updateDonationRequest = async(id, updates) => {
    return serverMutation(`/api/donation-request/${id}`, updates, 'PATCH');
}

export const deleteDonationRequest = async(id) => {
    return serverMutation(`/api/donation-request/${id}`, null, 'DELETE');
}