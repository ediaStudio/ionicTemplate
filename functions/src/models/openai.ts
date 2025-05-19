// TODO remplacez par votre clé api openai
// https://platform.openai.com/settings/organization/api-keys
export const GPT_KEY = "TODO";

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

// Liste de tous les modèles disponibles ici
// https://platform.openai.com/docs/models
// et le prix pour chaque model
// https://platform.openai.com/docs/pricing
export enum EGPTModel {
    turbo3 = "gpt-3.5-turbo",
    omni_moderation_latest = "omni-moderation-latest",
    gpt4_1mini = "gpt-4.1-mini",
    gpt4_0mini_search = "gpt-4o-mini-search-preview-2025-03-11\n",
    mini4 = "gpt-4o-mini",
}


