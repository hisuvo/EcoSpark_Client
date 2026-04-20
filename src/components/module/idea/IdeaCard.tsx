import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DollarSign,
  Link as LinkIcon,
  MessageSquare,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import { IIdea } from "@/type/idea.type";
import Image from "next/image";

const IdeaCard = ({ idea }: { idea: IIdea }) => {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-muted">
        {idea.imageUrl ? (
          <Image
            src={idea.imageUrl}
            alt={idea.title}
            width={500}
            height={500}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-green-50 dark:bg-green-950/30">
            <span className="text-4xl">🌱</span>
          </div>
        )}
        {idea?.isPaid && (
          <Badge className="absolute top-2 right-2 bg-amber-500 hover:bg-amber-600 text-white">
            <DollarSign className="h-3 w-3 mr-1" />
            Paid - ${idea.price?.toFixed(2)}
          </Badge>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-1">
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 hover:bg-green-200"
          >
            {idea.category?.name}
          </Badge>
        </div>
        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-green-600 transition-colors">
          {idea.title}
        </h3>
      </CardHeader>

      <CardContent className="flex-1 pb-2">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {idea.description}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-2 border-t">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <ThumbsUp className="h-3.5 w-3.5" />
            {idea?._count?.votes}
          </span>
          <span className="flex items-center gap-1">
            <ThumbsDown className="h-3.5 w-3.5" />
            {idea?._count?.votes}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" />
            {idea?._count?.comments}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/50"
          asChild
        >
          <Link href={`/ideas/${idea.id}`}>View Idea</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default IdeaCard;
