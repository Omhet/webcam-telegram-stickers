import axios from 'axios';
import Jimp from 'jimp';
import sharp from 'sharp';
import { fetchCams } from './api';
import { Img } from './types';

export const getCams = async () => {
    const { webcams } = await fetchCams();

    return webcams.map(
        ({
            image: {
                current: { preview },
            },
            location: { city },
        }) => ({
            image: preview,
            city,
        })
    );
};

const w = 512;
const h = 360;
export const getImageBuffer = async ({ url, label }: Img) => {
    const { data: imageBuffer } = await axios.get<Buffer>(url, {
        responseType: 'arraybuffer',
    });

    const textImage = new Jimp(w, h, 'transparent', (err) => {
        if (err) throw err;
    });
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
    const buf = await textImage
        .print(
            font,
            0,
            0,
            {
                text: label,
                alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
                alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM,
            },
            w,
            h
        )
        .getBufferAsync('image/png');

    const resized = sharp(imageBuffer)
        .resize(w, h)
        .composite([{ input: buf, gravity: 'centre' }])
        .toBuffer();

    return resized;
};
