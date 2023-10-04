import "./index.css";
import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { store } from "./redux";
import { theme, colorModeConfig } from "./chakraTheme";
import { BrowserRouter as Router } from 'react-router-dom';

const LightModeWrapper = ({ children }) => {
	React.useEffect(() => {
		localStorage.setItem("chakra-ui-color-mode", "light");
		localStorage.removeItem("chakra-ui-color-mode");
		localStorage.setItem("chakra-ui-color-mode", "light");
	});
	return <>{children}</>;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<ChakraProvider theme={theme}>
			<Provider store={store}>
				<LightModeWrapper>
					<ColorModeProvider options={colorModeConfig}>
						<App />
						<ToastContainer />
					</ColorModeProvider>
				</LightModeWrapper>
			</Provider>
		</ChakraProvider>
	</React.StrictMode>
);
