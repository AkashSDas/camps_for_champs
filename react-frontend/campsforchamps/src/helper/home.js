import { API } from "../backend"


export const getGalleryImages = () => {
    return fetch(`${API}gallery/`).then(response => response.json()).then(data => {
        const imagesArr = []
        data.map((dict) => {
            imagesArr.push(dict.image)
        })
        return imagesArr
    }).catch(err => console.log(err))
}
