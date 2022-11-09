import { userDetailsFormSchemaWithoutCV } from '../../utils/YupSchemas.js';
import { userModal } from '../../models/UserSchema.js';
import axios from 'axios';
import { Reader } from 'maxmind';
import fs from 'fs'

export const getCountry = (ip) => {

    return new Promise(async (resolve, reject) => {
        try {
            if (!ip) reject("");

            const buffer = fs.readFileSync(`${process.cwd()}/public/GeoLite2-Country.mmdb`);
            const lookup = new Reader(buffer);
            const city = lookup.get(ip);
            if (city.country.names.en) resolve(city.country.names.en);
            else reject("");
        }
        catch (error) {
            reject("");
        }
    })
}


export const userDetails = async (data, req, res) => {
    let country;
    try {
        const ip = req.ip
        country = await getCountry(ip);
    }
    catch (error) {
        country = "";
    }

    userDetailsFormSchemaWithoutCV.validate(data)
        .then(async (response) => {
            try {
                // checking if user already submitted the CV
                const { email, phone } = response;
                const user = await userModal.findOne({ $or: [{ email: email }, { phone: phone }] });
                if (user) {
                    return res.json({ success: false, msg: "Already Registered" });
                }

                // save to database
                data = { ...data, country: country }
                const newCV = new userModal(data);
                await newCV.save();

                return res.status(200).json({ success: true, msg: "Data successfully submitted", user: { email: email, userID: newCV?._id } })
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