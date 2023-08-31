import axios from "axios";
import "./App.css";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

function App() {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/greetings`
      );
      setMessage(data?.message || "");
    })();
    const keepLogin = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/user/keeplogin`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        dispatch(setValue(response.data));
      } catch (error) {
        localStorage.removeItem("token");
      }
    };
    keepLogin();
  }, []);
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {message}
      </header>
    </div>
  );
}

export default App;