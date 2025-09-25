const User = require("../models/User");


// ==================== Invitation Controller ====================
const getInvitation = async (req, res) => {
  try {
    const userId = req.user.id;  // from authMiddleware
    const user = await User.findById(userId).populate("referrals");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Referral link generate karo
    const referralLink = `https://yourdomain.com/signup?ref=${user.invitationCode}`;

    // Stats calculate
    const totalInvited = user.referrals.length;
    const totalRecharge = user.referrals.reduce((sum, ref) => sum + (ref.rechargeAmount || 0), 0);
    const totalCommission = user.referrals.reduce((sum, ref) => sum + (ref.commission || 0), 0);

    res.json({
      success: true,
      data: {
        referralLink,
        stats: {
          totalInvited,
          totalRecharge,
          totalCommission
        },
        referrals: user.referrals.map(ref => ({
          mobileNumber: ref.mobileNumber,
          recharge: ref.rechargeAmount,
          commission: ref.commission,
          status: ref.status
        }))
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { getInvitation };
