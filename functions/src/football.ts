import {HttpsError, onCall} from "firebase-functions/https";
import {EFunctionsErrorCode} from "./models/general";
import OpenAI from "openai";
import {EGPTModel, GPT_KEY} from "./models/openai";
import {zodTextFormat} from "openai/helpers/zod";
import {lastGamesSchema, MatchesSchema} from "@models/openaiJsonSchema";
import {db} from "./firebaseInit";

const openai = new OpenAI({
    apiKey: GPT_KEY
});

export const getMatchApi = onCall(async (request, response) => {

    const uid = request?.auth?.uid;

    if (!uid) {
        throw new HttpsError(
            EFunctionsErrorCode.UNAUTHENTICATED,
            "User is not authenticated.");
    }

    try {

        const lastGames = await getLastGames();
        if (lastGames?.length) {
            return lastGames;
        }

        const response = await getLastGamesChatGpt();
        console.log(response);

        const responseFormatted = JSON.parse(response?.output_text);

        await addLastGames(responseFormatted)

        return responseFormatted;
    } catch (e: any) {
        console.error(e);
        throw new HttpsError(
            EFunctionsErrorCode.INTERNAL,
            e?.message);
    }
});


// https://platform.openai.com/docs/guides/tools-web-searc
export async function getLastGamesChatGpt(): Promise<any> {

    try {
        const response = await openai.responses.create({
            model: EGPTModel.gpt4_1,
            tools: [{
                type: "web_search_preview",
                search_context_size: "high",
                user_location: {
                    type: "approximate",
                    country: "FR"
                }
            }],
            text: {
                format: zodTextFormat(lastGamesSchema, "event"), // https://www.npmjs.com/package/zod
            },
            input: "Liste moi les matchs de la prochaine journée de Ligue 1 (saison 2024-2025) avec pour chaque match : date, équipe à domicile, équipe à l’extérieur."
        });

        console.log(response);

        return response;

    } catch (error: any) {
        console.error(error);
        throw new HttpsError(
            EFunctionsErrorCode.INTERNAL,
            error.message);
    }
}

// https://platform.openai.com/docs/guides/tools-web-search
export async function queryWebSearchFormatted(): Promise<any> {

    try {
        const response = await openai.responses.create({
            model: EGPTModel.gpt4_1,
            tools: [{
                type: "web_search_preview",
                search_context_size: "high",
                user_location: {
                    type: "approximate",
                    country: "FR"
                }
            }],
            text: {
                format: zodTextFormat(MatchesSchema, "event"), // https://www.npmjs.com/package/zod
            },
            input: `Liste-moi tous les matchs de la dernière journée de Ligue 1 (saison 2024-2025) avec pour chaque match : date, équipe à domicile, équipe à l’extérieur, score final.`,
        });
        console.log(response);

        return response;

    } catch (error: any) {
        console.error(error);
        throw new HttpsError(
            EFunctionsErrorCode.INTERNAL,
            error.message);
    }
}


async function addLastGames(lastGames: any): Promise<any> {
    try {
        await db.collection("lastGames")
            .add(lastGames);
    } catch (e: any) {
        console.error(e);
    }

    return;
}

async function getLastGames(): Promise<any> {
    try {
        const res = await db.collection("lastGames")
            .get();
        if (!res?.empty) {
            return firestoreDocsToArray(res.docs);
        }
    } catch (e: any) {
        console.error(e);
    }

    return [];
}

export function firestoreDocsToArray(docs: any[]): any[] {
    const returnArr: any[] = [];
    let index = 0;
    docs.forEach(d => {
        if (d.exists) {
            const data = d.data();
            // data.ref = d.ref;
            data.documentId = d.id;
            data.index = index;
            returnArr.push(data);
            index++;
        }
    })

    return returnArr;
}


