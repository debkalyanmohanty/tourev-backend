const multer = require('multer')

const fileStorage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, 'images/');
    },
    filename: (req, file, cb) => {
        console.log(file)
      cb(null,  new Date().toISOString().substring(0,10) + '-' +file.originalname);
    }
  });
  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
const upload = multer({
    storage: fileStorage,
    fileFilter: fileFilter
})

module.exports = upload