import {HttpsError, onCall} from "firebase-functions/https";
import {EFunctionsErrorCode} from "./models/general";
import OpenAI from "openai";
import {EGPTModel, EGPTRole, GPT_KEY, IGPTMessage} from "./models/openai";
import {zodTextFormat} from "openai/helpers/zod";
import {MatchesSchema} from "@models/openaiJsonSchema";

const openai = new OpenAI({
    apiKey: GPT_KEY
});

export const openaiApi = onCall(async (request, response) => {

    // data from the frontend
    const query = request?.data?.query;
    const uid = request?.auth?.uid;

    if (!uid) {
        throw new HttpsError(
            EFunctionsErrorCode.UNAUTHENTICATED,
            "User is not authenticated.");
    }
    if (!query) {
        throw new HttpsError(
            EFunctionsErrorCode.FAILED_PRECONDITION,
            "Query is empty");
    }
    try {
        const response = await queryChatGptByPrompt(query);
        console.log(response);

        return response?.output_text || "";
    } catch (e: any) {
        console.error(e);
        throw new HttpsError(
            EFunctionsErrorCode.INTERNAL,
            e?.message);
    }
});

export const webSearchQuery = onCall(async (request, response) => {

    const uid = request?.auth?.uid;

    if (!uid) {
        throw new HttpsError(
            EFunctionsErrorCode.UNAUTHENTICATED,
            "User is not authenticated.");
    }

    try {
        const response = await queryWebSearch();

        return response?.output_text || "";
    } catch (e: any) {
        console.error(e);
        throw new HttpsError(
            EFunctionsErrorCode.INTERNAL,
            e?.message);
    }
});

export const webSearchQueryFormatted = onCall(async (request, response) => {

    const uid = request?.auth?.uid;

    if (!uid) {
        throw new HttpsError(
            EFunctionsErrorCode.UNAUTHENTICATED,
            "User is not authenticated.");
    }

    try {
        const response = await queryWebSearchFormatted();
        if (response?.output_text) {
            return JSON.parse(response?.output_text);
        }
        return;
    } catch (e: any) {
        console.error(e);
        throw new HttpsError(
            EFunctionsErrorCode.INTERNAL,
            e?.message);
    }
});


export async function queryChatGptByPrompt(
    prompt: string
): Promise<any> {

    try {

        const messages = [{
            role: EGPTRole.user,
            content: prompt
        } as IGPTMessage];


        console.log(messages);
        const response = await openai.responses.create({
            input: messages as any,
            model: EGPTModel.mini4,
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

// https://platform.openai.com/docs/guides/tools-web-searc
export async function queryWebSearch(): Promise<any> {

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
            input: "Liste-moi tous les matchs de la dernière journée de Ligue 1 (saison 2024-2025) avec pour chaque match : date, équipe à domicile, équipe à l’extérieur, score final.",
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
