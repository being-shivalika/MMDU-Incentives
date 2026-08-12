import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc Login user & get token
// @route POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is disabled",
      });
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        institute: user.institute,
        designation: user.designation,
        isFirstLogin: user.isFirstLogin === true,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get current logged in user
// @route GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,

      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        department: req.user.department,
        institute: req.user.institute,
        designation: req.user.designation,
        isFirstLogin: req.user.isFirstLogin === true,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Change password on first login
// @route POST /api/auth/change-first-password
export const changeFirstPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long.",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.password = newPassword;
    user.isFirstLogin = false;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        institute: user.institute,
        designation: user.designation,
        isFirstLogin: false,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Logout
// @route POST /api/auth/logout
export const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

// @desc Request password reset token / OTP
// @route POST /api/auth/forgot-password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide your registered email address.",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this registered email address.",
      });
    }

    // Generate 6-digit OTP code
    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetPasswordToken = resetOtp;
    user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry
    await user.save();

    console.log(`🔑 RESET PASSWORD OTP FOR ${user.email}: ${resetOtp}`);

    return res.status(200).json({
      success: true,
      message: "Password reset OTP generated successfully.",
      resetToken: resetOtp,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Reset password using OTP token
// @route POST /api/auth/reset-password
export const resetPassword = async (req, res, next) => {
  try {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, reset OTP token, and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long.",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      resetPasswordToken: String(token).trim(),
      resetPasswordExpire: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset OTP token.",
      });
    }

    // Set new password
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    next(error);
  }
};
