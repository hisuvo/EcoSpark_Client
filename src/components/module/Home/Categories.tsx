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

import { Globe } from "lucide-react";

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
                return (
                  <CarouselItem
                    key={index}
                    className="pl-4 md:basis-1/1 lg:basis-1/2 xl:basis-1/3"
                  >
                    {/* <div className="p-8 rounded-3xl bg-card border border-green-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 cursor-pointer group text-center flex flex-col items-center h-full">
                      <div className="mt-auto">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-muted text-[10px] font-bold text-muted-foreground uppercase tracking-widest group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                          {cat._count?.ideas ?? 0} Active Ideas
                        </span>
                      </div>

                      <h3 className="font-bold text-lg mb-2 line-clamp-1">
                        {cat.name}
                      </h3>

                      <p>{cat.description?.slice(0, 100)}...</p>
                    </div> */}

                    <div className="p-8 rounded-3xl bg-card border border-green-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 cursor-pointer group text-center flex flex-col items-center h-full">
                      {/* Category Name */}
                      <h3 className="font-bold text-xl mb-3 line-clamp-1 group-hover:text-primary transition-colors">
                        {cat.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-6 line-clamp-3 mb-6">
                        {cat.description}
                      </p>

                      {/* Active Ideas Badge */}
                      <div className="mt-auto">
                        <span className="inline-flex items-center rounded-full bg-muted px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
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
