/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import SectionHeader from "@/components/shared/SectionHeader";
import { getCategories } from "@/services/categories.service";

import {
  Leaf,
  Droplets,
  Recycle,
  Tractor,
  Building2,
  Lightbulb,
  Users,
  Globe,
} from "lucide-react";

export const categoryIcons: Record<string, any> = {
  "Green Technology": Leaf,
  "Water Conservation": Droplets,
  "Plastic Management": Recycle,
  "Sustainable Agriculture": Tractor,
  "Urban Planning": Building2,
  "Climate Awareness": Globe,
  "Community Development": Users,
  Elictrycity: Lightbulb,
};

const Categories = async () => {
  const categoryList = await getCategories();
  const categorie = categoryList?.data || [];
  return (
    <section className="py-24 bg-muted/20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-20 -left-10 w-64 h-64 bg-green-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-10 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader
          badge="Global Impact Areas"
          badgeIcon={Globe}
          title={
            <>
              Explore by <span className="text-primary">Category</span>
            </>
          }
          description="Find the sustainability projects that match your passion. Each category represents a vital pillar of environmental preservation."
        />

        <div className="px-12">
          {" "}
          {/* Padding for Carousel buttons */}
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {categorie.map((cat, index) => {
                const Icon = categoryIcons[cat.name] || Leaf;
                return (
                  <CarouselItem
                    key={index}
                    className="pl-4 md:basis-1/2 lg:basis-1/4 xl:basis-1/5"
                  >
                    <div className="p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 cursor-pointer group text-center flex flex-col items-center h-full">
                      <div
                        className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm`}
                      >
                        <Icon className="w-10 h-10 text-green-300" />
                        {/* <Icon className="w-5 h-5 text-green-600" /> */}
                      </div>
                      <h3 className="font-bold text-lg mb-2 line-clamp-1">
                        {cat.name}
                      </h3>
                      <div className="mt-auto">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-muted text-[10px] font-bold text-muted-foreground uppercase tracking-widest group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                          {cat._count?.ideas ?? 0} Active Ideas
                        </span>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="-left-6 h-12 w-12 border-2 hover:bg-primary hover:text-white transition-all shadow-md" />
            <CarouselNext className="-right-6 h-12 w-12 border-2 hover:bg-primary hover:text-white transition-all shadow-md" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Categories;
