import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { types } from "@/lib/data/types";
import { Pokemon, PokemonType } from "@/api/queries";
import { formatGenerationName } from "@/lib/utils";

export const PokemonCard = ({ pokemon }: { pokemon: Pokemon }) => {
  return (
    <Link
      href={`/pokemon/${pokemon.name}`}
      className="flex group p-4 relative flex-col border rounded-xl transition-all duration-300 hover:shadow-lg bg-gradient-to-b from-card to-background h-full"
      style={
        {
          "--tw-shadow-color": pokemon.colorCode,
          "--tw-shadow": "0 0 15px 2px var(--tw-shadow-color)",
        } as React.CSSProperties
      }
    >
      <Badge variant="outline" className="absolute top-2 right-2 z-10">
        {String(pokemon.id).padStart(3, "0")}
      </Badge>
      <div className="flex-1 flex flex-col items-center">
        <div className="h-[180px] w-full flex items-center justify-center">
          <Image
            src={pokemon.sprites.front_default ?? "/images/placeholder.webp"}
            alt={pokemon.name}
            width={500}
            height={500}
            className="object-contain p-4 object-center group-hover:scale-110 transition-all duration-300 max-h-full"
          />
        </div>
        <div className="flex flex-col gap-2 items-center text-center w-full mt-auto">
          <div className="flex flex-col gap-1 items-center text-center w-full">
            <p className="text-xs font-mono tracking-wider opacity-75">
              {formatGenerationName(pokemon.generation)}
            </p>
            <h2 className="text-lg font-bold uppercase truncate w-full max-w-[200px]">
              {pokemon.name}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {pokemon.types.map((type: PokemonType) => {
              const typeIcon = types.find(
                (t) => t.name === type.type.name
              )?.icon;
              return (
                <Tooltip key={type.type.name}>
                  <TooltipTrigger asChild>
                    <div>
                      <Image
                        src={typeIcon || ""}
                        alt={type.type.name}
                        width={24}
                        height={24}
                        className="object-center object-contain"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="capitalize">{type.type.name}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>
      </div>
    </Link>
  );
};
