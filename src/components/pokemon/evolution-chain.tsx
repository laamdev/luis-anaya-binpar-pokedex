import Image from "next/image";
import Link from "next/link";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { Pokemon } from "@/lib/api/types";

export const EvolutionChain = ({ pokemon }: { pokemon: Pokemon }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolution Chain</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          {pokemon.evolutions.map((evolution) => {
            const isCurrentPokemon = evolution.name === pokemon.name;

            return isCurrentPokemon ? (
              <div
                key={evolution.name}
                className="group flex flex-col items-center cursor-default"
              >
                <div
                  style={{
                    border: `3px solid ${pokemon.colorCode}`,
                  }}
                  className="relative size-24 bg-black rounded-xl overflow-hidden"
                >
                  <Image
                    src={evolution.sprites.front_default}
                    alt={evolution.name}
                    fill
                    className="object-cover p-4 object-center"
                  />
                </div>
                <span className="capitalize text-sm font-mono mt-2 text-primary">
                  {evolution.name}
                </span>
              </div>
            ) : (
              <Link
                href={`/pokemon/${evolution.name}`}
                key={evolution.name}
                className="group flex flex-col items-center"
              >
                <div className="relative size-24 bg-black rounded-xl overflow-hidden">
                  <Image
                    src={evolution.sprites.front_default}
                    alt={evolution.name}
                    fill
                    className="object-cover hover:scale-105 transition-all duration-300 p-4 object-center"
                  />
                </div>
                <span className="capitalize text-sm font-mono mt-2 group-hover:text-primary transition-colors">
                  {evolution.name}
                </span>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
