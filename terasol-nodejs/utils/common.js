const multer = require('multer');
const path = require('path')
var storage = multer.diskStorage({   
    destination: function(req, file, cb) { 
       cb(null, './images');    
    }, 
    filename: function (req, file, cb) { 
       cb(null , file.originalname);   
    }
 });
const upload = multer({ storage: storage }).single("profile");

function getFileUrl (req) {
    const protocol = req.protocol
    const host = req.header('host')
    const baseUrl = '/images/'
  
    return protocol + '://' + host + baseUrl
}
function getFilePath (fileName) {
    return path.resolve('./images/' + fileName)
  }
module.exports= {upload,getFileUrl,getFilePath}