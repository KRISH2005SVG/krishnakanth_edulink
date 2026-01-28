"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import * as React from "react";
import { Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useFirestore, useUser } from "@/firebase";
import { initiateEmailSignUp } from "@/firebase/non-blocking-login";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { doc } from "firebase/firestore";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { GraduationCap } from "lucide-react";


const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type FormData = z.infer<typeof formSchema>;

export default function SignupPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isCreatingProfile, setIsCreatingProfile] = React.useState(false);
  const [formData, setFormData] = React.useState<Omit<FormData, 'password'> | null>(null);

  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  React.useEffect(() => {
    if (user && !isUserLoading) {
      if (isCreatingProfile && formData) {
        const userId = user.uid;
        const userRef = doc(firestore, "users", userId);
        const profileRef = doc(firestore, "user_profiles", userId);

        const userData = {
          id: userId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: user.email,
          role: "student",
          profileId: userId,
        };

        const userProfileData = {
          id: userId,
          bio: "",
          profileImageUrl: "",
          subjects: [],
          availability: "",
        };
        
        setDocumentNonBlocking(userRef, userData, { merge: true });
        setDocumentNonBlocking(profileRef, userProfileData, { merge: true });
        
        setIsCreatingProfile(false);
        router.replace('/dashboard');

      } else if (!isCreatingProfile) {
        router.replace('/dashboard');
      }
    }
  }, [user, isUserLoading, router, isCreatingProfile, firestore, formData]);

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setFormData({ firstName: data.firstName, lastName: data.lastName, email: data.email });
    setIsCreatingProfile(true);
    try {
      initiateEmailSignUp(auth, data.email, data.password);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "An Error Occurred",
        description: error.message || "Failed to sign up. Please try again later.",
      });
      setIsLoading(false);
      setIsCreatingProfile(false);
    }
  }

  if (isUserLoading || user) {
     return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <Link href="/" className="flex items-center justify-center gap-2 text-primary mb-4">
                <GraduationCap className="w-10 h-10 text-primary" />
                <span className="font-bold text-4xl text-foreground">
                    EduLink
                </span>
            </Link>
            <h1 className="text-3xl font-bold font-headline">Create your Account</h1>
            <p className="text-muted-foreground">Join our community of learners and educators.</p>
        </div>
        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Fill in your details to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex gap-4">
                    <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                            <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                  Create Account
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
         <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
