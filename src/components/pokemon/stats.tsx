import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getStatColor } from "@/lib/utils";
import { Pokemon } from "@/lib/api/types";

export const Stats = ({ pokemon }: { pokemon: Pokemon }) => {
  return (
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
                      width: `${Math.min(100, (stat.base_stat / 100) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
