export const darkStorage = "darkMode";
export const onboardingStorage = "onboarding";

export enum EFunctionsErrorCode {
    OK = 'ok',
    CANCELLED = 'cancelled',
    UNKNOWN = 'unknown',
    INVALID_ARGUMENT = 'invalid-argument',
    DEADLINE_EXCEEDED = 'deadline-exceeded',
    NOT_FOUND = 'not-found',
    ALREADY_EXISTS = 'already-exists',
    PERMISSION_DENIED = 'permission-denied',
    RESOURCES_EXHAUSTED = 'resource-exhausted',
    FAILED_PRECONDITION = 'failed-precondition',
    ABORTED = 'aborted',
    OUT_OF_RANGE = 'out-of-range',
    UNIMPLEMENTED = 'unimplemented',
    INTERNAL = 'internal',
    UNAVAILABLE = 'unavailable', // ✅ corrected here
    DATA_LOSS = 'data-loss',
    UNAUTHENTICATED = 'unauthenticated',
}
