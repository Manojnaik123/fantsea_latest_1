const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage}=require('multer-storage-cloudinary');

const KEY='711285626671753';
const CLOUD='fantsea-co';
const SECRET='ORbCxcEJmSufWcD3S_p8gDFQqZs'

cloudinary.config({
    cloud_name:CLOUD,
    api_key:KEY,
    api_secret:SECRET
})

const storage=new CloudinaryStorage({
    cloudinary,
    params:{
        folder:'fantsea',
        allowedFormats:['jped','png','jpg']
    }
    
});

module.exports={
    cloudinary,
    storage
}