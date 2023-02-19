# Constructor

```js
import { createMimicInterface } from "./index.js"
let mimicInterface = createMimicInterface("http://0.0.0.0:59125")
```

change http://0.0.0.0:59125 if you are not hosting the 
mimic3 server on your own device

# Functions

## getVoices

```js
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

let voices = await mimicInterface.getVoices()
```

returns an object similar to

```js
[{
    key: 'de_DE/thorsten-emotion_low',
    language: 'German',
    name: 'thorsten-emotion_low',
    properties: { speaking_rate: 1, audio_noise: 0.333, phoneme_noise: 0.333 },
    speakers: [
      'amused',    'angry',
      'disgusted', 'drunk',
      'neutral',   'sleepy',
      'surprised', 'whisper'
    ]
  },
  
  {
    key: 'de_DE/thorsten_low',
    language: 'German',
    name: 'thorsten_low',
    properties: { speaking_rate: 1, audio_noise: 0.333, phoneme_noise: 0.333 },
    speakers: [ 'default' ]
  },

  ...
]
```

## getVoices

The result audio is always pcm_s16le format, perfect for a wav or raw file.
It always has one channel, 16 bits sample rate, and a sample rate of 22050.
It always has a bit rate of 352 kb/s

You can compress this further on your own using ffmpeg, or get a better
audio duration using ffprobe.

```js
interface voice {
    key: string,
    speaker: string,
    properties: {
        speaking_rate: number,
        audio_noise: number,
        phoneme_noise: number,
    }
} // get a voice from getVoices

let speakResult = await mimicInterface.speak("test", "another test", ..., voice) 
// You can put as many strings, and it will return a array of the same size.

console.log(speakResult)
```

returns an object similar to

```js
[
    {
        text: "test",
        audioBuffer: `<Buffer 52 49 46 46 24 e6 14 00 57 41 56 45 66 6d 74 20 10 00 00 00 01 00 01 00 22 56 00 00 44 ac 00 00 02 00 10 00 64 61 74 61 00 e6 14 00 d0 ff e2 ff e0 ff ... 136959 more bytes>`,
        duration: 0.2
    },

    {
        text: "another test",
        audioBuffer: `<Buffer 52 49 46 46 24 da 01 00 57 41 56 45 66 6d 74 20 10 00 00 00 01 00 01 00 22 56 00 00 44 ac 00 00 02 00 10 00 64 61 74 61 00 da 01 00 16 ff 31 ff 38 ff ... 121338 more bytes>`,
        duration: 0.5
    },

    ...
]
```