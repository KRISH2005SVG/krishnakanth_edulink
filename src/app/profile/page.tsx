"use client";

import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, DocumentData } from "firebase/firestore";
import { Loader2, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
                    <User className="mx-auto h-12 w-12 text-accent" />
                    <h1 className="text-3xl font-bold mt-4 font-headline">My Profile</h1>
                    <p className="mt-2 text-muted-foreground">View and manage your account details.</p>
                </div>
                <Card className="shadow-lg">
                    <CardHeader className="items-center text-center">
                         <Avatar className="h-24 w-24 mb-4">
                            <AvatarImage src={user.photoURL ?? ""} alt={userData.firstName} />
                            <AvatarFallback className="text-3xl">
                                {getInitials(`${userData.firstName} ${userData.lastName}`)}
                            </AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-2xl">{userData.firstName} {userData.lastName}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-muted-foreground">{userData.email}</p>
                        <p className="text-sm text-green-500 font-semibold mt-2 capitalize">{userData.role}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
