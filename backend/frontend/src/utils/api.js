import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

//function that intercepts requests and tries to add an access token if needed, and will retry a request under certain conditions
export const injectAuthToken = (getToken, setAccessToken) => {
  api.interceptors.request.use((config) => {
    //request for the object that will be sent out
    const token = getToken(); //get the LATEST token (has to be a function because javascript won't update otherwise)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; //if the token exists, send it in this format
    }
    return config; //let the config continue on its way
  });

  //response interceptor. if all goes well, just return the result. Otherwise, do the following function.
  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      //get the error object
      const originalRequest = error.config; //the request that was sent out

      /* These are things we don't want to repeat:
                - Any error that isn't 401(unauthorized)
                - Any requests to login, sign up, or refresh the token
                *If these are true, just send the error to the client

                - Any other request, we try to get a new access token, set the default header and the header of the original request to that token, and try the request again.
                    * If that still doesn't work, send the user back to the login page and just send the error to the client
            */
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes("/auth/refresh-token") &&
        !originalRequest.url.includes("/auth/login") &&
        !originalRequest.url.includes("/auth/signup")
      ) {
        originalRequest._retry = true;

        try {
          const { data } = await api.post("/auth/refresh-token");
          const newAccessToken = data.accessToken;

          setAccessToken(newAccessToken);

          api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return api(originalRequest);
        } catch (refreshError) {
          window.location.href = "/register"; //use this since this file is not in a route
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default api;
