import {HttpsError, onCall} from "firebase-functions/https";
import {EFunctionsErrorCode} from "./models/general";
import OpenAI from "openai";
import {EGPTModel, EGPTRole, GPT_KEY, IGPTMessage} from "./models/openai";

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
        let content: any[] = [];
        if (response?.output?.length) {
            const output = response?.output[0];
            if (output.content) {
                content = content.concat(output.content);
            }
        }
        return content;
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
        return response;
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
