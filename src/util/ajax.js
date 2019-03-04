const ajax = (method, url, options = {}) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    let {body = null, headers, timeout = 12000} = options
    xhr.open(method, url)
    if (headers && typeof(headers) === 'object') {
      Object.entries(headers).forEach(([header, value]) => xhr.setRequestHeader(header, value))
    }
    xhr.timeout = timeout
    xhr.send(body)

    xhr.onload = function () {
      if (xhr.status < 400) {
        try {
          resolve(JSON.parse(xhr.responseText))
        } catch (e) {
          resolve(xhr.responseText)
        }
      } else {
        console.log(xhr.statusText)
        try {
          reject(JSON.parse(xhr.responseText))
        } catch (e) {
          reject(xhr.responseText)
        }
      }
    }

    xhr.onerror = function () {
      reject(xhr.statusText)
    }

    xhr.ontimeout = function () {
      reject('Timeout!')
    }
  })
}
export default ajax