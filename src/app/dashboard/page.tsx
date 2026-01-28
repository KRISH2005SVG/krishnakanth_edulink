"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tutors } from "@/lib/data";
import type { Subject, Tutor } from "@/lib/types";
import { subjects } from "@/lib/types";
import { TutorCard } from "@/components/tutor-card";

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [subjectFilter, setSubjectFilter] = React.useState<Subject | "all">(
    "all"
  );
  const [availabilityFilter, setAvailabilityFilter] = React.useState("all");

  const filteredTutors = React.useMemo(() => {
    return tutors.filter((tutor) => {
      const matchesSearch =
        tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutor.headline.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject =
        subjectFilter === "all" || tutor.subjects.includes(subjectFilter);
      const matchesAvailability =
        availabilityFilter === "all" || tutor.availability === availabilityFilter;
      return matchesSearch && matchesSubject && matchesAvailability;
    });
  }, [searchTerm, subjectFilter, availabilityFilter]);

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Find Your Perfect Tutor</h2>
        <p className="text-muted-foreground max-w-2xl">
          Search our network of qualified tutors to find the right one for your needs. Filter by subject, availability, and more.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative md:col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or keyword..."
            className="pl-10 h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={subjectFilter}
          onValueChange={(value) => setSubjectFilter(value as Subject | 'all')}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Filter by subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={availabilityFilter}
          onValueChange={(value) => setAvailabilityFilter(value)}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Filter by availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Availabilities</SelectItem>
            <SelectItem value="Full-time">Full-time</SelectItem>
            <SelectItem value="Part-time">Part-time</SelectItem>
            <SelectItem value="Weekends only">Weekends only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredTutors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTutors.map((tutor) => (
            <TutorCard key={tutor.id} tutor={tutor} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-semibold">No Tutors Found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}
