'use server'

import { serverMutation, serverQuery } from "../core/server";

export const createFundingInfo = async(newFundingInfo) => {
    return serverMutation('/api/funding', newFundingInfo);
}

export const getFundingInfo = async (page, limit) => {
    const params = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;
    return serverQuery('/api/funding', params);
}