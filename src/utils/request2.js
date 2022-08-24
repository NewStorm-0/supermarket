import {ElMessage} from "element-plus";
import axios1 from '../main'

const get = (url, params, successFunction) => {
  axios1.get(url, params)
      .then((response) => {
        if (response.state === 0) {
          successFunction(response.data)
        } else {
          ElMessage.error(response.message)
        }
      })
      .catch((error) => {
        console.log(error)
      })
}

const post = (url, params, successFunction) => {
  axios1.post(url, params)
      .then((response) => {
        if (response.state === 0) {
          successFunction(response.data)
        } else {
          ElMessage.error(response.message)
        }
      })
      .catch((error) => {
        console.log(error)
      })
}

const axios2 = {
    get,
    post
}

export default axios2