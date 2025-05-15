import {HttpsError, onCall} from "firebase-functions/v2/https";
import {error} from "firebase-functions/logger";
import {db} from "./firebaseInit";
import {EFunctionsErrorCode} from "@models/general";

// Start writing functions
// https://firebase.google.com/docs/functions/callable?gen=2nd

export const setUserApi = onCall(async (request, response) => {

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
        const now = Date.now();
        const user = await getUser(uid);
        // Si l'utilisateur existe déjà, on le met à jour
        if (user) {
            await setUser(uid, {
                updated: now
            })
        } else {
            // Sinon, on le crée
            await setUser(uid, {
                userId: uid,
                name,
                picture,
                email,
                email_verified,
                created: now
            })
        }
        return;
    } catch (e: any) {
        error(e);
        throw new HttpsError(
            EFunctionsErrorCode.INTERNAL,
            "An error occurred while creating or updating the user.");
    }
});

// Création ou mise à jour de l'utilisateur
export async function setUser(userId: string, user: any): Promise<any> {
    try {
        await db.collection("users")
            .doc(userId)
            .set(user, {merge: true});
    } catch (e: any) {
        error(e);
        throw new HttpsError(
            EFunctionsErrorCode.INTERNAL,
            "An error occurred while creating or updating the user.");
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
        error(e);
    }

    return;
}
