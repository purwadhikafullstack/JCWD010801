import { extendTheme } from "@chakra-ui/react";

const colorModeConfig = {
	initialColorMode: "light",
	useSystemColorMode: false,
};

const theme = extendTheme({
	config: { initialColorMode: colorModeConfig.initialColorMode },
	styles: {
		global: {
			"html, body": {
				backgroundColor: "white",
			},
		},
	},
	components: {
		Switch: {
			baseStyle: {
				thumb: {
					bg: "black",
					_checked: {
						bg: "white",
					},
				},
				track: {
					bg: "#800808",
					_checked: {
						bg: "#006100",
					},
				},
			},
		},
	},
});

export { theme, colorModeConfig };
