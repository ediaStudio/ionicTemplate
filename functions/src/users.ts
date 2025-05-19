import {HttpsError, onCall} from "firebase-functions/v2/https";
import {db} from "./firebaseInit";
import {EFunctionsErrorCode} from "@models/general";
import {ELang} from "@models/language";

// Start writing functions
// https://firebase.google.com/docs/functions/callable?gen=2nd

export const setUserApi = onCall(async (request, response) => {

    const lang = request?.data?.lang || ELang.en;
    const uid = request?.auth?.uid;
    const name = request?.auth?.token.name || "";
    const picture = request?.auth?.token.picture || "";
    const email = request?.auth?.token.email || "";
    const email_verified = !!request?.auth?.token.email_verified;

    if (!uid) {
        throw new HttpsError(
            EFunctionsErrorCode.UNAUTHENTICATED,
            "User is not authenticated.");
    }
    try {
        const user = await getUser(uid);
        // Si l'utilisateur existe déjà, on le met à jour
        if (user) {
            await updateUser(uid, {
                lang
            })
        } else {
            // Sinon, on le crée
            await setUser(uid, {
                lang,
                userId: uid,
                name,
                picture,
                email,
                email_verified
            })
        }
        return;
    } catch (e: any) {
        console.error(e);
        throw new HttpsError(
            EFunctionsErrorCode.INTERNAL,
            "An error occurred while creating or updating the user.");
    }
});

// Création de l'utilisateur
export async function setUser(userId: string, user: any): Promise<any> {
    console.log(user);
    user.created = Date.now();
    try {
        await db.collection("users")
            .doc(userId)
            .set(user);
    } catch (e: any) {
        console.error(e);
        throw new HttpsError(
            EFunctionsErrorCode.INTERNAL,
            "An error occurred while creating the user.");
    }

    return user;
}

// Mise à jour de l'utilisateur
export async function updateUser(userId: string, user: any): Promise<any> {
    user.updated = Date.now();
    try {
        await db.collection("users")
            .doc(userId)
            .update(user);
    } catch (e: any) {
        console.error(e);
        throw new HttpsError(
            EFunctionsErrorCode.INTERNAL,
            "An error occurred while updating the user.");
    }

    return user;
}

// Récupération de l'utilisateur
export async function getUser(userId: string): Promise<any> {
    try {
        const res = await db.collection("users")
            .doc(userId)
            .get();
        if (res?.exists) {
            return res.data();
        }
    } catch (e: any) {
        console.error(e);
    }

    return;
}
