import { Button } from "@/components/ui/button";

import { ExternalLink } from "lucide-react";
import React, { useCallback } from "react";

interface EventdetailProps {
  event: TEvent;
}

const Eventdetail = ({ event }: EventdetailProps) => {
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);
  const formatTime = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }, []);
  return (
    <div className="flex min-h-full w-full items-start justify-center px-4 py-6">
      {/* Full-width card with max-width constraint */}
      <div className="w-full max-w-xl rounded-lg bg-white shadow-lg border border-gray-200 overflow-y-auto max-h-[90vh]">
        {/* Inner content with padding */}
        <div className="space-y-5 px-5 pt-6 pb-8">
          {/* Event Title */}
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            {event.title}
          </h1>

          {/* Date & Time */}
          <p className="text-base text-gray-700">
            <span className="block font-medium text-blue-600">
              {formatDate(event.dateTime)}
            </span>
            <span className="text-sm text-gray-500">
              {formatTime(event.dateTime)}
            </span>
          </p>

          {/* Location */}
          <p className="text-base text-gray-700">
            <span className="block font-medium text-red-600">
              {event.location}
            </span>
            {event.venue && (
              <span className="text-sm text-gray-500">{event.venue}</span>
            )}
          </p>

          {/* Organizer */}
          <p className="text-base text-gray-700">
            <span className="block font-medium text-green-600">Organizer</span>
            <span className="text-sm text-gray-500">{event.organizer}</span>
          </p>

          {/* Attendee Limit */}
          {event.attendeeLimit && (
            <p className="text-base text-gray-700">
              <span className="block font-medium text-purple-600">
                Capacity
              </span>
              <span className="text-sm text-gray-500">
                {event.attendeeLimit} attendees
              </span>
            </p>
          )}

          <div className="border-t border-gray-200"></div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              About This Event
            </h2>
            <p className="mt-1 text-gray-700 leading-relaxed whitespace-pre-line text-sm">
              {event.description}
            </p>
          </div>

          {/* Pricing */}
          {event.price && (
            <>
              <div className="border-t border-gray-200"></div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Pricing</h3>
                <p className="text-2xl font-bold text-green-600">
                  {event.price}
                </p>
              </div>
            </>
          )}

          {/* Important Note */}
          {event.pleaseNote && (
            <>
              <div className="border-t border-gray-200"></div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Important Information
                </h3>
                <p className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-700 leading-relaxed">
                  {event.pleaseNote}
                </p>
              </div>
            </>
          )}

          {/* Sticky Action Button */}
          <div className="sticky bottom-0 bg-white pt-5 pb-2">
            {event.ticketUrl ? (
              <Button
                asChild
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium">
                <a
                  href={event.ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Buy tickets on Ticketmaster">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Buy Tickets on Ticketmaster
                </a>
              </Button>
            ) : (
              <Button
                disabled
                size="lg"
                className="w-full bg-gray-200 text-gray-400 font-medium cursor-not-allowed">
                Tickets Not Available
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Eventdetail;
