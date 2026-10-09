import { NextResponse } from "next/server";
import redis from "@/app/redis";

export async function GET(req: Request) {
  if (!redis) {
    return NextResponse.json({
      visits: 0,
      today: 0,
    });
  }

  const url = new URL(req.url);
  const shouldIncrement =
    url.searchParams.get("incr") === "1";

  if (shouldIncrement) {
    const totalVisits =
      await redis.incr("site:visits");

    const today =
      new Intl.DateTimeFormat("sv-SE", {
        timeZone: "Asia/Shanghai",
      }).format(new Date());

    const todayKey =
      `site:visits:${today}`;

    const todayVisits =
      await redis.incr(todayKey);

    if (todayVisits === 1) {
      const now = new Date();

      const tomorrow =
        new Date(
          now.toLocaleString(
            "en-US",
            {
              timeZone: "Asia/Shanghai",
            },
          ),
        );

      tomorrow.setHours(
        24,
        0,
        0,
        0,
      );

      const secondsUntilTomorrow =
        Math.max(
          60,
          Math.floor(
            (tomorrow.getTime() -
              now.getTime()) /
              1000,
          ),
        );

      await redis.expire(
        todayKey,
        secondsUntilTomorrow,
      );
    }

    return NextResponse.json({
      visits: totalVisits,
      today: todayVisits,
    });
  }

  const totalVisits =
    (await redis.get("site:visits")) ?? 0;

  const today =
    new Intl.DateTimeFormat("sv-SE", {
      timeZone: "Asia/Shanghai",
    }).format(new Date());

  const todayKey =
    `site:visits:${today}`;

  const todayVisits =
    (await redis.get(todayKey)) ?? 0;

  return NextResponse.json({
    visits: totalVisits,
    today: todayVisits,
  });
}
