import { Telegram } from 'telegraf';
import { Sticker, StickerData } from 'telegraf/typings/telegram-types';
import config from './config';
import { Img } from './types';
import { getImageBuffer } from './utils';

export const getStickerPackName = async (telegram: Telegram) => {
    const stickerPackName = 'webcams_stickers';
    const { username } = await telegram.getMe();

    return `${stickerPackName}_by_${username}`;
};

export const getStickerPack = async (telegram: Telegram) => {
    const packName = await getStickerPackName(telegram);

    return telegram.getStickerSet(packName);
};

export const updateStickers = async (
    telegram: Telegram,
    images: Img[],
    stickers: Sticker[],
    onUpdate?: (index: number) => void
) => {
    for (let i = 0; i < images.length; i++) {
        const sticker = stickers[i];
        const image = images[i];
        await updateSticker(telegram, image, sticker);
        onUpdate && onUpdate(i);
    }
};

export const updateSticker = async (
    telegram: Telegram,
    image: Img,
    sticker?: Sticker
) => {
    if (sticker !== undefined) {
        await deleteSticker(telegram, sticker);
    }

    await addSticker(telegram, image);
};

export const deleteSticker = async (telegram: Telegram, sticker: Sticker) => {
    return telegram.deleteStickerFromSet(sticker.file_id);
};

export const addSticker = async (telegram: Telegram, image: Img) => {
    const packName = await getStickerPackName(telegram);

    const newStickerFile = await telegram.uploadStickerFile(
        Number(config.OWNER_ID),
        {
            source: await getImageBuffer(image),
        }
    );

    const stickerData = {
        png_sticker: newStickerFile.file_id,
        emojis: '🏙️',
    } as StickerData;

    await telegram.addStickerToSet(
        Number(config.OWNER_ID),
        packName,
        stickerData,
        false
    );
};
