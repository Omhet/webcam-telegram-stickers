import { Telegram } from 'telegraf';
import config from './config';
import { getCams } from './utils';
import { getStickerPack, updateStickers } from './stickers';
import { Img } from './types';

const main = async () => {
    const telegram = new Telegram(config.BOT_TOKEN!);
    const pack = await getStickerPack(telegram);
    const cams = await getCams();
    const images: Img[] = cams.map(({ image, city }) => ({
        url: image,
        label: city,
    }));

    updateStickers(telegram, images, pack.stickers, (index) => {
        const { image, city } = cams[index];
        console.log(`Updated: ${city} - ${image}`);
    });
};
main();
