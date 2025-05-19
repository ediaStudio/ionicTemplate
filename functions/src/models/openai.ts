// TODO remplacez par votre clé api openai
// https://platform.openai.com/settings/organization/api-keys
export const GPT_KEY = "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";

export interface IGPTMessage {
    role: EGPTRole;
    content: string;
    name?: string; // An optional name for the participant. Provides the model information to differentiate between participants of the same role.
    created?: number; // ms
}

export enum EGPTRole {
    system = "system",
    assistant = "assistant",
    user = "user",
}

export enum EGPTModel {
    turbo3 = "gpt-3.5-turbo",
    mini4 = "gpt-4o-mini",
}


