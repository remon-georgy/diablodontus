export const syncData = () => {
  // FIXME get url from config
  return fetch('http://192.168.1.108:8800/sync')
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson;
    })
    .catch((error) => {
      console.error(error);
    });
}