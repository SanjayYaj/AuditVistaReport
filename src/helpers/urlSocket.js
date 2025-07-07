import axios from 'axios'

var urlSocket = axios.create({
  /* LIVE URL*/
  baseURL: 'http://localhost:8050/',
  //  baseURL: 'https://auditvista.com/audit-vista-v2-api/',
  // baseURL: 'http://172.16.1.130:8050/',
  // baseURL: "https://auditvista.com/audit-vista-venu-version-api/",

  withCredentials: true, // Send cookies (refreshToken)
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 0,
})

const clearSessionInfo = async () => {
  var authUser = JSON.parse(sessionStorage.getItem("authUser"))
  const responseData = await urlSocket.post("handle-session/logout-session", {
    user_id: authUser.user_data._id,
    encrypted_db_url: authUser.db_info.encrypted_db_url,
  })
  //console.log(responseData,'responseData')
  if (responseData.data.response_code === 500) {
    localStorage.clear()
    sessionStorage.clear()
    window.location.href = "/login"; // Redirect to login
  }

}


urlSocket.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

urlSocket.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    //console.log(error,'error',isRefreshing,originalRequest);
    if (error.response && error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            resolve(urlSocket(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const { data } = await urlSocket.post(
          "cog/refresh-token",
          {},
          { withCredentials: true } // Ensure cookies are sent
        );
        //console.log(data,'data');
        localStorage.setItem("accessToken", data.accessToken);
        onRefreshed(data.accessToken);

        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token expired. Redirecting to login.");
        await clearSessionInfo()
        localStorage.clear();
        sessionStorage.clear()
        window.location.href = "/login"; // Redirect to login
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);





export default urlSocket