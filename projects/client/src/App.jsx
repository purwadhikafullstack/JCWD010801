import Axios from "axios";
import { AppRouter } from './routes/index'
import { RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setValue } from './redux/userSlice';

function App() {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  useEffect(() => {
    const keepLogin = async () => {
      try {
        const response = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/user/keeplogin`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        dispatch(setValue(response.data));
      } catch (error) {
        localStorage.removeItem("token");
        console.log(error);
      }
    };
    keepLogin();
  }, [dispatch, token]);

  return (
    <RouterProvider router={AppRouter} />
  );
};

export default App;