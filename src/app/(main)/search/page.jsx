import { searchDonors } from "@/lib/actions/donors";
import { SearchClient } from "./SearchClient";

export const metadata = {
  title: "Find Donors | PulseLink",
  description: "Search blood donors by blood group and location in Bangladesh.",
};

export default async function SearchPage({ searchParams }) {
  const { bloodGroup, district, upazila } = await searchParams;

  // Pre-fetch on the server if all params exist (supports direct URL sharing)
  let initialDonors = null;
  if (bloodGroup && district && upazila) {
    initialDonors = await searchDonors({ bloodGroup, district, upazila });
  }

  return (
    <SearchClient
      initialDonors={initialDonors}
      initialParams={{ bloodGroup, district, upazila }}
    />
  );
}