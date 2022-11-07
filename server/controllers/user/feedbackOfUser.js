import { feedbackModal } from "../../models/FeedbackSchema.js";
import { userModal } from "../../models/UserSchema.js";

export const FeedBack = {

    createfeedback: async (req, res) => {
        const { text, userID} = req.body;
        if (!text || !userID) {
            return res.json({ success: false, msg: 'Feedback cannot be empty' })
        }

        await userModal.findOne({ userID }).then(
            async (user) => {
                if (!user) {
                    return res.json({ success: false, msg: 'User not found' })
                }
                else {
                    await feedbackModal.create(
                        {
                            text: text,
                            userID: userID,
                            name: user.fullName,
                        }
                    )
                    res.status(200).json({ success: true, msg: 'Feedback Given Successfully' });
                }
            }
        ).catch(err => {
            res.json({ success: false, msg: 'Unexpected Error Occured' })
        })

    },
}






