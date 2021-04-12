export function camelCase(subject: string): string {
    return subject.toLowerCase()
        .replace(/-(\w)/g, (match, char) => char.toUpperCase());
}

export function kebabCase(subject: string): string {
    return subject
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[_\s]/, '-')
        .toLowerCase();
}

export function isNumeric(subject: any) {
    return !Array.isArray(subject) && !isNaN(subject)
}
