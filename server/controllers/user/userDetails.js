import { userDetailsFormSchemaWithoutCV } from '../../utils/YupSchemas.js';
import { userModal } from '../../models/UserSchema.js';
import axios from 'axios';
import { Reader } from 'maxmind';
import fs from 'fs'

export const getCountry = () => {

    return new Promise(async(resolve, reject) => {
        try {
            const res = await axios.get("https://www.cloudflare.com/cdn-cgi/trace");
            let arr = res.data.split("\n")
            let ip = arr.filter(item => item.includes("ip"))[0].split("=")[1];
            
            if (!ip) reject("");

            const buffer = fs.readFileSync(`${process.cwd()}/public/GeoLite2-Country.mmdb`);
            const lookup = new Reader(buffer);
            const city = lookup.get(ip);

            if(city.country.names.en) resolve(city.country.names.en);
            else reject("");
        }
        catch (error) {
            reject("");
        }
    })
}





export const userDetails = async(data, req, res) => {
    let country; 
    try {
        country = await getCountry();
    }
    catch (error) {
        country = "";
    }

    userDetailsFormSchemaWithoutCV.validate(data)
        .then(async (response) => {
            try {
                // checking if user already submitted the CV
                const { email } = response;
                const user = await userModal.findOne({ email });
                if (user) {
                    return res.json({ success: false, msg: "Already Registered" });
                }

                // save to database
                data = {...data, country:country}
                const newCV = new userModal(data);
                await newCV.save();
                
                return res.json({ success: true, msg: "Data successfully submitted", user: { email: email, userID: newCV?._id } })
            }
            catch (error) {
                console.log(error)
                return res.json({ success: false, msg: "Internal Server Error Occurred!!" })
            }
        })
        .catch(err => {
            return res.json({ success: false, msg: "Validation error occurred, Please re-check you details", error: err.message?.replace(".mimetype", " type") })
        })
}