// export const BASE_URL = "http://localhost:5000";
// 
// export const BASE_URL = "https://devapi.mappes.io";

// export const BASE_URL = "https://api.mappes.io";



let backendHost = "";
const hostname = window && window.location && window.location.hostname;
if(hostname === 'mappes.io') {
    backendHost = "https://api.mappes.io";
}else if(hostname === 'www.mappes.io') {
  backendHost = "https://api.mappes.io";
}else if(hostname === 'staging.mappes.io') {
  backendHost = "https://stagingapi.mappes.io";
} else if(hostname === 'devapp.mappes.io') {
  backendHost = "https://devapi.mappes.io";

} else {
  backendHost = 'http://localhost:5000';
}

export const BASE_URL = `${backendHost}`;