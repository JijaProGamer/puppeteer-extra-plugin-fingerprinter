interface anyString {
    [key: string]: string
}

interface Fingerprint {
    webgl_vendor: string,
    webgl_renderer: string,
    userAgent: string,
    language: string,
    cpus: number,
    memory: number,

    viewport: {
        width: number,
        height: number
    },
    canvas: {
        shift: number,
        chance: number,
    },
    compatibleMediaMimes: {
        audio: string[],
        video: anyString,
    },
}

function boolReturn(choser: any): bool 

interface fingerprintGeneratorOptions {
    webgl_vendor: string | boolReturn | null,
    webgl_renderer: string | boolReturn | null,
    language: string | boolReturn | null,
    userAgent: string | boolReturn | null,
    viewport: {width: number, height: number} | boolReturn | null,
    cpus: number | boolReturn | null,
    memory: number | boolReturn | null,
    compatibleMediaMimes: {audio: string[], video: anyString,} | boolReturn | null,
    canvas: {chance: number, shift: number} | boolReturn | null,
}

export class FingerprinterPlugin {
    get availableEvasions(): string[];
    get enabledEvasions(): Set<string>;
    get dependencies(): string[];
    get name(): string;
    set enabledEvasions(evasions: Set<string>): undefined;
}

export function generateFingerprint(options: fingerprintGeneratorOptions | null): FingerprinterPlugin
export function createFingerprinterInterface(): FingerprinterPlugin
export declare const commonFingerprint: Fingerprint