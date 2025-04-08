import React from "react";
import Image from "next/image";
import Link from "next/link";

import { badgeVariants } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getPokemonById } from "@/api/queries";
import { types } from "@/lib/data/types";
import { getStatColor } from "@/lib/helpers";

interface PokemonPageProps {
  params: Promise<{ id: string }>;
}

export default async function PokemonPage({ params }: PokemonPageProps) {
  const { id } = await params;
  const pokemon = await getPokemonById(id);

  return (
    <div className="px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
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
                    {pokemon.generation
                      .replace("generation-", "Gen ")
                      .toUpperCase()}
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
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pokemon.stats.map((stat) => {
                  const statColor = getStatColor(stat.base_stat);
                  const [textColor, bgColor] = statColor.split(" ");

                  return (
                    <div key={stat.stat.name} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="capitalize">{stat.stat.name}</span>
                        <span className={`font-medium ${textColor}`}>
                          {stat.base_stat}
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full">
                        <div
                          className={`h-full rounded-full ${bgColor}`}
                          style={{
                            width: `${Math.min(
                              100,
                              (stat.base_stat / 100) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
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
                        className="relative size-24 bg-black rounded-xl"
                        style={{
                          border: `3px solid ${pokemon.colorCode}`,
                          borderRadius: "0.5rem",
                        }}
                      >
                        <Image
                          src={evolution.image}
                          alt={evolution.name}
                          fill
                          className="object-cover rounded-xl p-4 object-center"
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
                      <div className="relative size-24 bg-black">
                        <Image
                          src={evolution.image}
                          alt={evolution.name}
                          fill
                          className="object-cover hover:scale-105 transition-all duration-300 rounded-xl p-4 object-center"
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
        </div>
      </div>
    </div>
  );
}
