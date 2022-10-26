import { adminModal } from "../../models/AdminSchema.js";

const login = async(email, password, res) => {
  try {
    const admin = await adminModal.findOne({email}, {password:1});

    if(!admin || admin.password !== password){
        return res.json({success:false, msg:"No user found"})
    }

    return res.json({success:true})
  }
  catch (error) {
    return res.json({success:false, msg:"Internal server error occurred"})
  }
}

export default login