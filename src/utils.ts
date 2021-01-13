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

    const textImage = await getTextImage(label);

    return sharp(imageBuffer)
        .resize(w, h)
        .composite([{ input: textImage, gravity: 'southwest' }])
        .toBuffer();
};

export const getTextImage = async (text: string) => {
    const backHeight = 40;

    const textImage = new Jimp(w, backHeight, 'rgba(0,0,0,0.5)', (err) => {
        if (err) throw err;
    });
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
    return textImage
        .print(
            font,
            6,
            0,
            {
                text,
                alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
                alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
            },
            w,
            backHeight
        )
        .getBufferAsync('image/png');
};
