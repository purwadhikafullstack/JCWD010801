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
    // components: {
    //     Radio: {
    //         baseStyle: {
    //             borderColor: "gray",
    //             _checked: {
    //                 boxShadow: '0 0 3px 2px #39393C',
    //                 bg: 'transparent',
    //                 color: 'gray.700',
    //                 borderColor: 'gray.700',
    //                 _before: {
    //                     content: '""',
    //                     display: 'block',
    //                     width: '50%',
    //                     height: '50%',
    //                     borderRadius: '50%',
    //                     bg: '#4A4A4A',
    //                 },
    //             },
    //             _focus: {
    //                 boxShadow: '0 0 3px 2px #39393C',
    //             },
    //         },   styling component hardcode udah kayak orang bener
    //     },       baca documentation macam mau nangis
    // },           how lah bang pls help chakraProvider nya kurang ajar
});

export { theme, colorModeConfig };