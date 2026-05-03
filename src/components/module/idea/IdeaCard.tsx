import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  ArrowRight,
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
    <Card className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full bg-card/50 backdrop-blur-sm">
      {/* Image Container */}
      <div className="relative h-52 overflow-hidden">
        {idea.imageUrl ? (
          <Image
            src={idea.imageUrl}
            alt={idea.title}
            width={500}
            height={500}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/20 dark:to-emerald-900/20">
            <span className="text-5xl group-hover:scale-110 transition-transform duration-500">🌱</span>
          </div>
        )}
        
        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <Badge
            className="bg-white/90 dark:bg-black/80 text-green-700 dark:text-green-400 backdrop-blur-md border-none font-semibold px-2.5 py-0.5 shadow-sm"
          >
            {idea.category?.name}
          </Badge>
        </div>

        {idea?.isPaid && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-amber-500/90 hover:bg-amber-500 text-white backdrop-blur-md border-none shadow-sm">
              <DollarSign className="h-3 w-3 mr-1" />
              ${idea.price?.toFixed(2)}
            </Badge>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <CardHeader className="pb-3 space-y-2">
        <h3 className="font-bold text-xl leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {idea.title}
        </h3>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {idea.description}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-between py-4 border-t border-border/50 bg-muted/5">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5 group/vote cursor-default">
            <div className="p-1.5 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 group-hover/vote:bg-green-600 group-hover/vote:text-white transition-colors">
              <ThumbsUp className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm font-semibold">{idea?._count?.votes || 0}</span>
          </div>
          <div className="flex items-center gap-1.5 group/comment cursor-default">
            <div className="p-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover/comment:bg-blue-600 group-hover/comment:text-white transition-colors">
              <MessageSquare className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm font-semibold">{idea?._count?.comments || 0}</span>
          </div>
        </div>
        
        <Button
          variant="secondary"
          size="sm"
          className="rounded-full font-semibold px-4 hover:bg-primary hover:text-primary-foreground transition-all duration-300 group/btn"
          asChild
        >
          <Link href={`/ideas/${idea.id}`}>
            Details
            <ArrowRight className="ml-1.5 h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default IdeaCard;
