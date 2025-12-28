const passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{10,}$/;

/**
 * Überprüft, ob ein Passwort den Sicherheitsanforderungen entspricht.
 *
 * Anforderungen:
 * - Mindestens 10 Zeichen lang
 * - Mindestens 1 Kleinbuchstabe
 * - Mindestens 1 Großbuchstabe
 * - Mindestens 1 Zahl
 * - Mindestens 1 Sonderzeichen (inkl. Leerzeichen)
 */
export function isPasswordStrong(password: string): boolean {
    return passwordRegex.test(password);
}
