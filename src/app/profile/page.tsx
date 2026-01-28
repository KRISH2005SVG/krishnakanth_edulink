"use client";

import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, DocumentData } from "firebase/firestore";
import { Loader2, User, Mail, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    const userRef = useMemoFirebase(() => {
        if (!user) return null;
        return doc(firestore, "users", user.uid);
    }, [firestore, user]);

    const { data: userData, isLoading: isUserDataLoading } = useDoc<DocumentData>(userRef);

    if (isUserLoading || isUserDataLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user || !userData) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-bold">User not found</h2>
                <p className="text-muted-foreground">Please log in to view your profile.</p>
            </div>
        );
    }
    
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('');
    }

    return (
        <div className="container mx-auto py-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <User className="mx-auto h-12 w-12 text-primary" />
                    <h1 className="text-4xl font-bold mt-4 font-headline">My Profile</h1>
                    <p className="mt-2 text-muted-foreground text-lg">View and manage your account details.</p>
                </div>
                <Card className="shadow-xl">
                    <CardHeader className="items-center text-center p-6 bg-muted/30">
                         <Avatar className="h-28 w-28 mb-4 border-4 border-primary">
                            <AvatarImage src={user.photoURL ?? ""} alt={userData.firstName} />
                            <AvatarFallback className="text-4xl">
                                {getInitials(`${userData.firstName} ${userData.lastName}`)}
                            </AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-3xl">{userData.firstName} {userData.lastName}</CardTitle>
                        <CardDescription className="text-base">Student</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-4">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <span className="text-muted-foreground">{userData.email}</span>
                        </div>
                        <Separator />
                        <div className="flex items-center gap-4">
                            <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                            <span className="text-muted-foreground capitalize">Role: {userData.role}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
