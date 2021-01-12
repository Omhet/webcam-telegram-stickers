import { Telegram } from 'telegraf';
import { Sticker, StickerData } from 'telegraf/typings/telegram-types';
import config from './config';
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
    imageUrls: string[],
    stickers: Sticker[],
    onUpdate?: (index: number) => void
) => {
    for (let i = 0; i < imageUrls.length; i++) {
        const sticker = stickers[i];
        const image = imageUrls[i];
        await updateSticker(telegram, image, sticker);
        onUpdate && onUpdate(i);
    }
};

export const updateSticker = async (
    telegram: Telegram,
    imageUrl: string,
    sticker?: Sticker
) => {
    if (sticker !== undefined) {
        await deleteSticker(telegram, sticker);
    }

    await addSticker(telegram, imageUrl);
};

export const deleteSticker = async (telegram: Telegram, sticker: Sticker) => {
    return telegram.deleteStickerFromSet(sticker.file_id);
};

export const addSticker = async (telegram: Telegram, imageUrl: string) => {
    const packName = await getStickerPackName(telegram);

    const newStickerFile = await telegram.uploadStickerFile(
        Number(config.OWNER_ID),
        {
            source: await getImageBuffer(imageUrl),
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
