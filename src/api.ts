import axios from 'axios';
import config from './config';
import { ApiWebcamsResponse, Webcam } from './types';

axios.defaults.baseURL = config.WEBCAM_API;

export const fetchCams = async () => {
    const { data: { result } } = await axios.request<ApiWebcamsResponse>({
        url: 'list/country=RU/orderby=popularity',
        params: {
            key: config.WEBCAM_API_KEY,
            show:  'webcams:image,location'
        },
    });

    return result;
};
