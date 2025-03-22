import { Buffer } from 'buffer';
import net from 'net';

export const loadFirefoxAddon = (port, host, addonPath) => {
    return new Promise((resolve) => {
        const socket = net.connect({
            port,
            host,
        });

        let success = false;

        socket.once('error', () => {});
        socket.once('close', () => {
            resolve(success);
        });

        const send = (data) => {
            const raw = Buffer.from(JSON.stringify(data));

            socket.write(`${raw.length}`);
            socket.write(':');
            socket.write(raw);
        };

        send({
            to: 'root',
            type: 'getRoot',
        });

        const onMessage = (message) => {
            if (message.addonsActor) {
                send({
                    to: message.addonsActor,
                    type: 'installTemporaryAddon',
                    addonPath,
                });
            }

            if (message.addon) {
                success = true;
                socket.end();
            }

            if (message.error) {
                socket.end();
            }
        };

        const buffers = [];
        let remainingBytes = 0;

        socket.on('data', (data) => {
            while (true) {
                if (remainingBytes === 0) {
                    const index = data.indexOf(':');

                    buffers.push(data);

                    if (index === -1) {
                        return;
                    }

                    const buffer = Buffer.concat(buffers);
                    const bufferIndex = buffer.indexOf(':');

                    buffers.length = 0;
                    remainingBytes = Number(buffer.subarray(0, bufferIndex).toString());

                    if (!Number.isFinite(remainingBytes)) {
                        throw new Error('Invalid state');
                    }

                    data = buffer.subarray(bufferIndex + 1);
                }

                if (data.length < remainingBytes) {
                    remainingBytes -= data.length;
                    buffers.push(data);
                    break;
                } else {
                    buffers.push(data.subarray(0, remainingBytes));

                    const buffer = Buffer.concat(buffers);
                    buffers.length = 0;

                    const json = JSON.parse(buffer.toString());
                    queueMicrotask(() => {
                        onMessage(json);
                    });

                    const remainder = data.subarray(remainingBytes);
                    remainingBytes = 0;

                    if (remainder.length === 0) {
                        break;
                    } else {
                        data = remainder;
                    }
                }
            }
        });
    });
};