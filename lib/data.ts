import { config } from "@/lib/config";

// Ticketmaster API configuration
const TICKETMASTER_API_KEY = config.apiKey;
const TICKETMASTER_BASE_URL = "https://app.ticketmaster.com/discovery/v2";

// Helper function to normalize Ticketmaster event to our Event interface
export function normalizeTicketmasterEvent(tmEvent: TicketmasterEvent): TEvent {
  const venue = tmEvent._embedded?.venues?.[0];
  const classification = tmEvent.classifications?.[0];
  const priceRange = tmEvent.priceRanges?.[0];

  // Create location string
  const city = venue?.city?.name || "";
  const state = venue?.state?.stateCode || venue?.state?.name || "";
  const country = venue?.country?.countryCode || venue?.country?.name || "";
  const location = [city, state, country].filter(Boolean).join(", ");

  // Format price
  let price = "Price varies";
  if (priceRange) {
    if (priceRange.min === priceRange.max) {
      price = `$${priceRange.min}`;
    } else {
      price = `$${priceRange.min} - $${priceRange.max}`;
    }
  }

  // Get best image
  const image =
    tmEvent.images?.find((img) => img.width >= 640) || tmEvent.images?.[0];

  // Format date time
  let dateTime = tmEvent.dates.start.localDate;
  if (tmEvent.dates.start.localTime) {
    dateTime += `T${tmEvent.dates.start.localTime}`;
  } else if (tmEvent.dates.start.dateTime) {
    dateTime = tmEvent.dates.start.dateTime;
  } else {
    dateTime += "T00:00:00";
  }

  return {
    id: tmEvent.id,
    title: tmEvent.name,
    description:
      tmEvent.info ||
      tmEvent.pleaseNote ||
      "No description available for this event.",
    location,
    venue: venue?.name || "Venue TBA",
    dateTime,
    eventType: classification?.segment?.name || "Event",
    organizer:
      tmEvent.promoter?.name ||
      tmEvent._embedded?.attractions?.[0]?.name ||
      "Event Organizer",
    price,
    imageUrl: image?.url,
    ticketUrl: tmEvent.url,
    pleaseNote: tmEvent.pleaseNote,
  };
}

// API functions
export async function fetchEvents(params: {
  keyword?: string;
  city?: string;
  classificationName?: string;
  startDateTime?: string;
  endDateTime?: string;
  page?: number;
  size?: number;
}): Promise<{ events: TEvent[]; totalPages: number; totalElements: number }> {
  const searchParams = new URLSearchParams({
    apikey: TICKETMASTER_API_KEY,
    size: (params.size || 20).toString(),
    page: (params.page || 0).toString(),
  });

  // Add optional parameters
  if (params.keyword) searchParams.append("keyword", params.keyword);
  if (params.city) searchParams.append("city", params.city);
  if (params.classificationName)
    searchParams.append("classificationName", params.classificationName);
  if (params.startDateTime)
    searchParams.append("startDateTime", params.startDateTime);
  if (params.endDateTime)
    searchParams.append("endDateTime", params.endDateTime);

  try {
    const response = await fetch(
      `${TICKETMASTER_BASE_URL}/events.json?${searchParams}`
    );

    if (!response.ok) {
      throw new Error(
        `Ticketmaster API error: ${response.status} ${response.statusText}`
      );
    }

    const data: TicketmasterResponse = await response.json();

    const events =
      data._embedded?.events?.map(normalizeTicketmasterEvent) || [];

    return {
      events,
      totalPages: data.page.totalPages,
      totalElements: data.page.totalElements,
    };
  } catch (error) {
    console.error("Error fetching events from Ticketmaster:", error);
    throw error;
  }
}

export async function fetchEventClassifications(): Promise<string[]> {
  try {
    const response = await fetch(
      `${TICKETMASTER_BASE_URL}/classifications.json?apikey=${TICKETMASTER_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Ticketmaster API error: ${response.status}`);
    }

    const data = await response.json();
    const classifications = data._embedded?.classifications || [];
    // Extract unique genre names
    const genres = new Set<string>();

    classifications.forEach((classification: any) => {
      if (classification?.segment?.name) {
        genres.add(classification?.segment?.name);
      } else if (classification?.type?.name) {
        genres.add(classification?.type?.name);
      }
    });

    return Array.from(genres).sort();
  } catch (error) {
    console.error("Error fetching classifications:", error);
    // Return default classifications if API fails
    return ["Music", "Sports", "Arts & Theatre", "Film", "Miscellaneous"];
  }
}
