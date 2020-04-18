import axios from "axios";

const instance = axios.create({
  baseURL: "https://my-react-burger-87f18.firebaseio.com/",
});
export default instance;
