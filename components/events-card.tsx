"use client";
import { useCallback } from "react";

import { Calendar, MapPin, Clock } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Badge,
  Button,
} from "@/components/ui";
import { getEventTypeColor } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface EventCardProps {
  event: TEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
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

  const truncateDescription = useCallback((text: string, maxLength = 120) => {
    if (text?.length <= maxLength) return text;
    return text?.substring(0, maxLength) + "...";
  }, []);

  const getEventImage = useCallback((event: TEvent) => {
    if (event?.imageUrl) {
      return event.imageUrl;
    }
    // Fallback to placeholder
    return `/placeholder.svg?height=200&width=400&text=${encodeURIComponent(
      event?.title
    )}`;
  }, []);

  return (
    <Link href={`/detail/${event.id}`}>
      <Card className="group flex h-full cursor-pointer flex-col transition-shadow duration-200 hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="mb-2 flex items-start justify-between">
            <Badge
              className={`${getEventTypeColor(event?.eventType)} border-0`}>
              {event?.eventType || "Unknown"}
            </Badge>
            <div className="text-right text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                {formatDate(event?.dateTime)}
              </div>
            </div>
          </div>
          <h3 className="group-hover:text-muted-foreground text-lg leading-tight font-semibold transition-colors">
            {event?.title}
          </h3>
        </CardHeader>

        <div className="relative h-48 overflow-hidden">
          <Image
            width={100}
            height={100}
            src={getEventImage(event) || "/placeholder.svg"}
            alt={event?.title}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `/placeholder.svg?height=200&width=400&text=${encodeURIComponent(
                event?.title
              )}`;
            }}
          />
        </div>

        <CardContent className="flex-1 pb-2">
          <p className="mb-3 text-sm leading-relaxed text-gray-600">
            {truncateDescription(event?.description)}
          </p>

          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="truncate">{event?.location}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 flex-shrink-0" />
              <span>{formatTime(event?.dateTime)}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-2">
          <Button className="group-hover:bg-primary/70 w-full cursor-pointer rounded-sm transition-colors">
            View Details
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default EventCard;
