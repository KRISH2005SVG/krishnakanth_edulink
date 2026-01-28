"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import type { Tutor } from "@/lib/types";

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];

export function SessionBooking({ tutor }: { tutor: Tutor }) {
  const [date, setDate] = React.useState<Date>();
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);

  const handleBooking = () => {
    if (!date || !selectedTime) {
      toast({
        variant: "destructive",
        title: "Incomplete Selection",
        description: "Please select a date and time to book a session.",
      });
      return;
    }

    toast({
      title: "Session Booked!",
      description: `Your session with ${
        tutor.name
      } is confirmed for ${format(date, "PPP")} at ${selectedTime}.`,
    });

    // Reset state after booking
    setDate(undefined);
    setSelectedTime(null);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Book a Session</CardTitle>
        <CardDescription>
          Starting from{" "}
          <span className="font-bold text-primary">${tutor.pricePerHour}/hr</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="font-medium">Select a Date</h3>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(date) =>
                  date < new Date(new Date().setHours(0, 0, 0, 0))
                }
              />
            </PopoverContent>
          </Popover>
        </div>
        {date && (
          <div className="space-y-2">
            <h3 className="font-medium">Select a Time</h3>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  onClick={() => setSelectedTime(time)}
                  className="flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  {time}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleBooking}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          disabled={!date || !selectedTime}
        >
          Book Session
        </Button>
      </CardFooter>
    </Card>
  );
}
