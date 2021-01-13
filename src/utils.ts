import axios from "axios";
import sharp from "sharp";
import { fetchCams } from "./api";

export const getCams = async () => {
    const { webcams } = await fetchCams();

    return webcams.map(({ image: { current: { preview } }, location: { city } }) => ({
        image: preview,
        city
    }))
}

export const getImageBuffer = async (imageUrl: string) => {
    const { data: imageBuffer } = await axios.get<Buffer>(imageUrl, {
        responseType: 'arraybuffer',
    });

    return await sharp(imageBuffer).resize(512, 360).toBuffer();
}