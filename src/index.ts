import { Telegram } from 'telegraf';
import config from './config';
import { getCams } from './utils';
import { getStickerPack, updateStickers } from './stickers';

const main = async () => {
    const telegram = new Telegram(config.BOT_TOKEN!);
    const pack = await getStickerPack(telegram);
    const cams = await getCams();
    const imageUrls = cams.map(({ image }) => image);

    updateStickers(telegram, imageUrls, pack.stickers, (index) => {
        const { image, city } = cams[index];
        console.log(`Updated: ${city} - ${image}`);
    });
};
main();
