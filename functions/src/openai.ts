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
