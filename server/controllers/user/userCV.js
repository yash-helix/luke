import { userDetailsFormSchema } from '../../utils/YupSchemas.js';
import { userModal } from '../../models/UserSchema.js';
import UploadToS3 from './UploadToS3.js';
import { getCountry } from './userDetails.js';

export const userCV = async (data, req, res) => {
    let country;
    try {
        country = await getCountry();
    }
    catch (error) {
        country = "";
    }

    userDetailsFormSchema.validate(data)
        .then(async (response) => {
            try {
                const filename = `${Date.now()}_${response.file.name}`;

                // checking if user already submitted the CV
                const { email, phone } = response;
                const user = await userModal.findOne({$or: [{email:email}, {phone:phone}]});
                if (user) {
                    return res.status(406).json({ success: false, msg: "Already Registered" });
                }

                // save details to db and file to s3
                else if (response.file?.data) {
                    const isFileUploaded = await UploadToS3(filename, response);

                    if (isFileUploaded?.success !== true) {
                        return res.json({ success: false, msg: isFileUploaded.msg || "File not saved" })
                    }

                    // save to database
                    let s3File = 'https://luke-pdf.s3.ap-south-1.amazonaws.com/' + filename
                    const dataToSave = { ...data, country: country, file: s3File };
                    const newCV = new userModal(dataToSave);
                    await newCV.save();

                    return res.status(200).json({ success: true, msg: "File uploaded and data successfully submitted", user: { email: email, userID: newCV?._id } })
                }
                else {
                    return res(400).json({ success: false, msg: "Something went wrong, Possibly file not found" })
                }
            }
            catch (error) {
                console.log(error)
                return res.status(500).json({ success: false, msg: "Internal Server Error Occurred!!" })
            }
        })
        .catch(err => {
            return res.status(401).json({ success: false, msg: "Validation error occurred, Please re-check you details", error: err.message?.replace(".mimetype", " type") })
        })
}