import ffmpeg from "fluent-ffmpeg"
import ffmpegPath from "ffmpeg-static"

ffmpeg.setFfmpegPath(ffmpegPath as string)

export default async function oggToMp3(inputFile: string, outputFile: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        ffmpeg(inputFile)
        .output(outputFile)
        .on('end', () => {
            resolve();
        })
        .on('error', (err) => {
            reject(err);
        })
        .run();
    });
};