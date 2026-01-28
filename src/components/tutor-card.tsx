import Image from 'next/image';
import Link from 'next/link';
import { Star, BookOpen, DollarSign } from 'lucide-react';
import type { Tutor } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-4 h-4 text-accent fill-accent" />
      ))}
      {halfStar && <Star key="half" className="w-4 h-4 text-accent" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-muted-foreground/20 fill-muted-foreground/20" />
      ))}
       <span className="ml-2 text-sm text-muted-foreground">{rating.toFixed(1)}</span>
    </div>
  );
}

export function TutorCard({ tutor }: { tutor: Tutor }) {
  const placeholderImage = PlaceHolderImages.find(img => img.id === tutor.avatarId);
  
  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 rounded-lg">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
            {placeholderImage && (
              <Image
                src={placeholderImage.imageUrl}
                alt={`Photo of ${tutor.name}`}
                fill
                className="object-cover"
                data-ai-hint={placeholderImage.imageHint}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex items-center justify-between mb-2">
            <StarRating rating={tutor.rating} />
            <Badge variant="secondary" className="capitalize">{tutor.availability}</Badge>
        </div>
        <h3 className="text-lg font-bold font-headline">{tutor.name}</h3>
        <p className="text-sm text-muted-foreground h-10">{tutor.headline}</p>
        <div className="mt-4 flex flex-wrap gap-2">
            {tutor.subjects.slice(0, 2).map(s => <Badge key={s} variant="outline">{s}</Badge>)}
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-1">
            <DollarSign className="w-5 h-5 text-primary" />
            <span className="text-lg font-bold text-primary">{tutor.pricePerHour}</span>
            <span className="text-sm text-muted-foreground">/hr</span>
        </div>
        <Button asChild size="sm">
          <Link href={`/tutors/${tutor.id}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
