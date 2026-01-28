import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Star, CheckCircle, GraduationCap, Briefcase, User } from 'lucide-react';

import { tutors } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Header Section */}
          <Card className="overflow-hidden shadow-md">
            <CardContent className="p-6 flex flex-col sm:flex-row gap-6 items-start">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden flex-shrink-0 border-4 border-primary">
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
              <div className="space-y-2">
                <h1 className="text-3xl font-bold font-headline">{tutor.name}</h1>
                <p className="text-lg text-muted-foreground">{tutor.headline}</p>
                <div className="pt-2">
                  <StarRating rating={tutor.rating} reviewCount={tutor.reviews.length} />
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {tutor.subjects.map((s) => (
                    <Badge key={s} variant="secondary" className="text-sm">{s}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About Section */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><User /> About {tutor.name.split(' ')[0]}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{tutor.bio}</p>
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Qualifications */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl"><GraduationCap /> Qualifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tutor.qualifications.map((q, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <p className="text-muted-foreground">{q}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Experience */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl"><Briefcase /> Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{tutor.experience}</p>
              </CardContent>
            </Card>
          </div>

          {/* Reviews Section */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Student Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {tutor.reviews.map((review, index) => (
                <React.Fragment key={review.id}>
                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarFallback>{review.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{review.name}</p>
                        <div className="flex">
                            {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-accent fill-accent"/>)}
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm mt-1">{review.comment}</p>
                    </div>
                  </div>
                  {index < tutor.reviews.length - 1 && <Separator />}
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
