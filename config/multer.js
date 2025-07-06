import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: 'uploads/ profile-pics',
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = `${req.user.id}-${Date.now()}${ext}`;
        cb(null, name);
    },
});

const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowed.includes(file.mimetype))
        cb(null, true);
    else cb(new Error('Only images are allowed'), false);
};

const upload = multer({storage, fileFilter});

export default upload;