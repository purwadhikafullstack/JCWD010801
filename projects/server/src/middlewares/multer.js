const multer = require('multer');

module.exports = {
    multerUpload: (directory = "./public", name = "PIMG") => {
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, directory)
            },
            filename: (req, file, cb) => {
                cb(null,
                    name +
                    "-" +
                    Date.now() +
                    Math.round(Math.random() * 1000000000) +
                    "." +
                    file.mimetype.split('/')[1]
                );
            }
        });

        const fileFilter = (req, file, cb) => {
            const ext = file.mimetype.split('/')[1].toLowerCase();
            const extFilter = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
            const checkExt = extFilter.includes(ext);

            if (!checkExt) {
                cb(new Error("The file you are trying to upload is not supported. Only JPG, JPEG, PNG, WEBP, and GIF file formats are allowed."), false);
            } else {
                cb(null, true);
            };
        };

        const limits = {
            fileSize: 1 * 1024 * 1024, 
        };

        return multer({ storage: storage, fileFilter: fileFilter, limits: limits });
    }
};