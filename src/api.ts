import axios from 'axios';
import config from './config';
import { ApiWebcamsResponse } from './types';

axios.defaults.baseURL = config.WEBCAM_API;

const favouriteWebcams = [
    '1495633357',
    '1608105343',
    '1335532071',
    '1410334776',
    '1239891154',
    '1607842156',
    '1490087893',
    '1347204870',
    '1515416356',
    '1566540215',
    '1444993841',
    '1581179786',
    '1332946601',
    '1608143973',
    '1515276672',
];

export const fetchCams = async () => {
    const {
        data: { result },
    } = await axios.request<ApiWebcamsResponse>({
        url: `list/webcam=${favouriteWebcams.join(',')}/limit=${favouriteWebcams.length}`,
        params: {
            key: config.WEBCAM_API_KEY,
            show: 'webcams:image,location',
        },
    });

    return result;
};
