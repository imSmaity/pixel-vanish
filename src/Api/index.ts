import Axios from 'axios'
import { config } from '../apiConfig'
import { IInputImage } from '../types'

const axiosInstance = Axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/plain, */*',
  },
})

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  removeImageBackground({ fileName, base64String }: IInputImage) {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(config.IMAGE.BASE, { fileName, base64String })
        .then((res) => resolve(res.data))
        .catch((error) => reject(error))
    })
  },
}
