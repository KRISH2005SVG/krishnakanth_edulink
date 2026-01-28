import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Star, CheckCircle, GraduationCap, Briefcase, User, MessageSquare } from 'lucide-react';
import * as React from 'react';

import { tutors } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SessionBooking } from '@/components/session-booking';

function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-accent fill-accent' : 'text-muted-foreground/30'}`}
          />
        ))}
      </div>
      <span className="font-bold text-lg">{rating.toFixed(1)}</span>
      <span className="text-muted-foreground">({reviewCount} reviews)</span>
    </div>
  );
}

export default function TutorProfilePage({ params }: { params: { id: string } }) {
  const tutor = tutors.find((t) => t.id === params.id);

  if (!tutor) {
    notFound();
  }

  const placeholderImage = PlaceHolderImages.find((img) => img.id === tutor.avatarId);

  return (
    <div className="container mx-auto max-w-7xl py-8">
      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-2 space-y-8">
          {/* Header Section */}
          <Card className="overflow-hidden shadow-lg">
            <CardContent className="p-6 flex flex-col sm:flex-row gap-6 items-center">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden flex-shrink-0 border-4 border-primary shadow-lg">
                {placeholderImage && (
                  <Image
                    src={placeholderImage.imageUrl}
                    alt={`Photo of ${tutor.name}`}
                    fill
                    className="object-cover"
                    data-ai-hint={placeholderImage.imageHint}
                    sizes="160px"
                  />
                )}
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl font-bold font-headline">{tutor.name}</h1>
                <p className="text-xl text-muted-foreground">{tutor.headline}</p>
                <div className="pt-2">
                  <StarRating rating={tutor.rating} reviewCount={tutor.reviews.length} />
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {tutor.subjects.map((s) => (
                    <Badge key={s} variant="secondary" className="text-sm px-3 py-1">{s}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl"><User className="text-primary"/> About {tutor.name.split(' ')[0]}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-base">{tutor.bio}</p>
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Qualifications */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl"><GraduationCap className="text-primary" /> Qualifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tutor.qualifications.map((q, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <p className="text-muted-foreground text-base">{q}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Experience */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl"><Briefcase className="text-primary"/> Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-base">{tutor.experience}</p>
              </CardContent>
            </Card>
          </div>

          {/* Reviews Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl"><MessageSquare className="text-primary"/> Student Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {tutor.reviews.map((review, index) => (
                <React.Fragment key={review.id}>
                  <div className="flex gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="text-xl bg-muted">{review.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-lg">{review.name}</p>
                        <div className="flex">
                            {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-5 h-5 text-accent fill-accent"/>)}
                        </div>
                      </div>
                      <p className="text-muted-foreground text-base mt-1">{review.comment}</p>
                    </div>
                  </div>
                  {index < tutor.reviews.length - 1 && <Separator className="my-6" />}
                </React.Fragment>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sticky Booking Card */}
        <div className="lg:sticky top-24 self-start">
          <SessionBooking tutor={tutor} />
        </div>
      </div>
    </div>
  );
}
