import {z} from 'zod';
// https://www.npmjs.com/package/zod
export const MatchesSchema = z.object({
    games: z.array(
        z.object({
            date: z.string(),
            home_team: z.string(),
            away_team: z.string(),
            score: z.string(),
        })
    ),
});

export const lastGamesSchema = z.object({
    games: z.array(
        z.object({
            date: z.string(),
            home_team: z.string(),
            away_team: z.string()
        })
    ),
});
