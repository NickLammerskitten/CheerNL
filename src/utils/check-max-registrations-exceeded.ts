export function checkMaxRegistrationsExceeded(maxRegistrations: number | null, registrationCount: number) {
    if (!maxRegistrations) {
        return false;
    }

    return registrationCount >= maxRegistrations;
}