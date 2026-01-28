"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import * as React from "react";
import { Loader2, Lightbulb, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { subjects, type Subject } from "@/lib/types";
import { getTutorSuggestions } from "@/actions/matching";
import type { SmartTutorMatchingOutput } from "@/ai/flows/smart-tutor-matching";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  learningGoals: z
    .string()
    .min(10, { message: "Please describe your learning goals in at least 10 characters." }),
  academicNeeds: z
    .string()
    .min(10, { message: "Please describe your academic needs in at least 10 characters." }),
  subjects: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one subject.",
    }),
});

type FormData = z.infer<typeof formSchema>;

export default function SmartMatchingPage() {
  const [suggestions, setSuggestions] = React.useState<SmartTutorMatchingOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      learningGoals: "",
      academicNeeds: "",
      subjects: [],
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setSuggestions(null);
    try {
      const result = await getTutorSuggestions(data);
      setSuggestions(result);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An Error Occurred",
        description: "Failed to get suggestions. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <Lightbulb className="mx-auto h-12 w-12 text-accent" />
          <h1 className="text-3xl font-bold mt-4 font-headline">Smart Tutor Matching</h1>
          <p className="mt-2 text-muted-foreground">
            Let our AI find the perfect tutor for you. Just tell us what you need.
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Your Learning Profile</CardTitle>
            <CardDescription>Fill out the form below to get personalized tutor recommendations.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="learningGoals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What are your learning goals?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., 'I want to improve my grade from a B to an A in Calculus II' or 'Prepare for the AP Physics exam'"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="academicNeeds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Describe your academic needs.</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., 'I struggle with understanding key concepts' or 'I need help with homework and exam preparation'"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subjects"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Which subject(s) do you need help with?</FormLabel>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {subjects.map((subject) => (
                        <FormField
                          key={subject}
                          control={form.control}
                          name="subjects"
                          render={({ field }) => (
                            <FormItem key={subject} className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(subject)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, subject])
                                      : field.onChange(field.value?.filter((value) => value !== subject));
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{subject}</FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
                  Find My Tutor
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="text-center mt-10">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">Analyzing your needs and finding the best matches...</p>
          </div>
        )}

        {suggestions && suggestions.tutorSuggestions.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-center mb-6 font-headline">Here are your top suggestions!</h2>
            <div className="grid gap-6">
              {suggestions.tutorSuggestions.map((tutor, index) => (
                <Card key={index} className="shadow-md">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{tutor.name}</CardTitle>
                        <CardDescription>{tutor.subject}</CardDescription>
                      </div>
                      <div className="flex items-center gap-1 text-accent font-bold">
                        <Star className="w-5 h-5 fill-accent" />
                        <span>{tutor.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><span className="font-semibold">Experience:</span> {tutor.experience}</p>
                    <p><span className="font-semibold">Availability:</span> {tutor.availability}</p>
                    <Button className="mt-4 w-full" variant="outline">View Profile & Book</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
