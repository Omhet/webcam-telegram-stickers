export interface Webcam {
    image: {
        current: {
            preview: string;
        }
    },
    location: {
        city: string;
    }
}

export interface ApiWebcamsResponse {
    result: {
        webcams: Webcam[]
    }
}