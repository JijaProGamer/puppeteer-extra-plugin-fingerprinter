interface voice {
    key: string,
    language: string,
    name: string,
    speakers: string[],
    default_properties: {
        speaking_rate: number,
        audio_noise: number,
        phoneme_noise: number,
    }
}


interface singleVoice {
    key: string,
    speaker: string,
    properties: {
        speaking_rate: number,
        audio_noise: number,
        phoneme_noise: number,
    }
}

interface speakResult {
    text: string,
    audioBuffer: Buffer,
    duration: number,
}

export class FingerprinterPlugin {
    get availableEvasions(): string[];
    get enabledEvasions(): Set<string>;
    get dependencies(): string[];
    get name(): string;
    set enabledEvasions(evasions: Set<string>): undefined;

    speak(text: string | string[], voice: singleVoice): Promise<speakResult[]>;
}

export function createFingerprinterInterface(server_url: string): FingerprinterPlugin