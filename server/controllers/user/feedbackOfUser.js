import { feedbackModal } from "../../models/FeedbackSchema.js";
import { userModal } from "../../models/UserSchema.js";

export const FeedBack = {

    createfeedback: async (req, res) => {
        const { text, userID } = req.body
        await userModal.findOne({ userID }).then(
            async (user) => {
                if (!user) {
                    return res.json({ msg: 'User not found' })
                }
                else {
                    const feedback = await feedbackModal.create(
                        {
                            text: text,
                            userID: userID,
                        }
                    )
                    // feedback.save();
                    res.send('Feedback Given Successfully');
                }
            }
        )

    },
}
