import Link from "next/link";
import Image from "next/image";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { badgeVariants } from "@/components/ui/badge";

import { types } from "@/lib/data/types";
import { Pokemon } from "@/lib/api/types";

export const MainInfo = ({ pokemon }: { pokemon: Pokemon }) => {
  return (
    <Card>
      <div className="relative aspect-square rounded-xl bg-gradient-to-b from-background to-transparent">
        <Image
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          fill
          className="p-8 object-contain"
        />
      </div>
      <CardHeader>
        <CardTitle className="capitalize">{pokemon.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Types</h3>
            <div className="flex flex-wrap gap-2">
              {pokemon.types.map((type) => {
                const typeColor = types.find(
                  (t) => t.name === type.type.name
                )?.color;
                return (
                  <Link
                    key={type.type.name}
                    href={`/?type=${type.type.name}`}
                    className={badgeVariants({
                      variant: "secondary",
                      className: "hover:opacity-80",
                    })}
                    style={{ backgroundColor: typeColor }}
                  >
                    {type.type.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Generation</h3>
            <Link
              href={`/?generation=${pokemon.generation}`}
              className={badgeVariants({ variant: "default" })}
            >
              {pokemon.generation.replace("generation-", "Gen ").toUpperCase()}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Height</h3>
            <div className={badgeVariants({ variant: "outline" })}>
              {(pokemon.height / 10).toFixed(1)} m
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Weight</h3>
            <div className={badgeVariants({ variant: "outline" })}>
              {(pokemon.weight / 10).toFixed(1)} kg
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
