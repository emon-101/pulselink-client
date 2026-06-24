'use server'

import { serverQuery } from "../core/server";

export const searchDonors = async({ bloodGroup, district, upazila }) => {
    if(!bloodGroup || !district || !upazila) return [];
    return serverQuery('/api/donors/search', { bloodGroup, district, upazila });
}