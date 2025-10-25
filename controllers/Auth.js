const User = require("../models/User");
const bcrypt = require('bcryptjs');
const { sendMail } = require("../utils/Emails");
const { generateOTP } = require("../utils/GenerateOtp");
const Otp = require("../models/OTP");
const { sanitizeUser } = require("../utils/SanitizeUser");
const { generateToken } = require("../utils/GenerateToken");
const PasswordResetToken = require("../models/PasswordResetToken");

exports.signup = async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email })

        // if user already exists
        if (existingUser) {
            return res.status(400).json({ "message": "User already exists" })
        }

        // hashing the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        req.body.password = hashedPassword

        // creating new user
        const createdUser = new User(req.body)
        await createdUser.save()

        // getting secure user info
        const secureInfo = sanitizeUser(createdUser)

        // generating jwt token
        const token = generateToken(secureInfo)

        // sending jwt token in the response cookies
        res.cookie('token', token, {
            sameSite: process.env.PRODUCTION === 'true' ? "None" : 'Lax',
            maxAge: new Date(Date.now() + (parseInt(process.env.COOKIE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000))),
            httpOnly: true,
            secure: process.env.PRODUCTION === 'true' ? true : false
        })

        const otp = generateOTP(); // Tạo OTP
        const hashedOtp = await bcrypt.hash(otp, 10);

        // Xóa các OTP cũ (nếu có)
        await Otp.deleteMany({ user: createdUser._id });

        // Lưu OTP đã hash vào DB
        const newOtp = new Otp({
            user: createdUser._id,
            otp: hashedOtp,
            expiresAt: Date.now() + parseInt(process.env.OTP_EXPIRATION_TIME),
        });
        await newOtp.save();

        // Gửi OTP đến email (tiếng Việt)
        const subject = "🔐 Mã xác thực OTP của bạn";
        const body = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2>Xin chào ${createdUser.fullname || createdUser.email},</h2>
                <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>Shop của chúng tôi</strong>.</p>
                <p>Để hoàn tất đăng ký, vui lòng nhập mã OTP sau vào hệ thống:</p>
                <h2 style="color:#1a73e8; letter-spacing: 3px;">${otp}</h2>
                <p>Mã OTP này sẽ hết hạn sau <strong>${parseInt(process.env.OTP_EXPIRATION_TIME) / (60 * 1000)} phút</strong>.</p>
                <br>
                <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.</p>
                <p>Trân trọng,</p>
                <p>Đội ngũ hỗ trợ <strong>${process.env.APP_NAME || "Shop của chúng tôi"}</strong></p>
                <hr>
                <p style="font-size: 12px; color: #999;">Email này được gửi tự động, vui lòng không trả lời lại.</p>
            </div>
        `;

        await sendMail(createdUser.email, subject, body);

        res.status(200).json({ message: 'Signup success, please verify your email' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error occured during signup, please try again later" })
    }
}

exports.login = async (req, res) => {
    try {
        // checking if user exists or not
        const existingUser = await User.findOne({ email: req.body.email })

        if (!existingUser) {
            res.clearCookie('token')
            return res.status(404).json({ message: "Invalid Credentials" })
        }

        // Check if user is blocked / not verified
        if (!existingUser.isVerified) {
            res.clearCookie('token')
            return res.status(403).json({ message: "User has been blocked" })
        }

        // checking password
        const isPasswordValid = await bcrypt.compare(req.body.password, existingUser.password)
        if (!isPasswordValid) {
            res.clearCookie('token')
            return res.status(404).json({ message: "Invalid Credentials" })
        }

        // getting secure user info
        const secureInfo = sanitizeUser(existingUser)

        // generating jwt token
        const token = generateToken(secureInfo)

        // sending jwt token in the response cookies
        res.cookie('token', token, {
            sameSite: process.env.PRODUCTION === 'true' ? "None" : 'Lax',
            maxAge: new Date(Date.now() + (parseInt(process.env.COOKIE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000))),
            httpOnly: true,
            secure: process.env.PRODUCTION === 'true' ? true : false
        })

        delete secureInfo._id
        delete secureInfo.email

        return res.status(200).json({ message: 'Login successful', user: secureInfo })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Some error occurred while logging in, please try again later' })
    }
}


exports.verifyOtp = async (req, res) => {
    try {
        // Lấy userId từ req.user (được thiết lập bởi middleware verifyToken)
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        // Kiểm tra user có tồn tại không
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Tìm OTP đã lưu trong DB cho user này
        const userOtp = await Otp.findOne({ user: userId });
        if (!userOtp) {
            return res.status(404).json({ message: "No OTP found for this user" });
        }

        // Kiểm tra OTP đã hết hạn chưa
        if (userOtp.expiresAt < new Date()) {
            await Otp.findByIdAndDelete(userOtp._id);
            return res.status(400).json({ message: "OTP has expired" });
        }

        // So sánh OTP đã nhập với OTP đã hash trong DB
        const isMatch = await bcrypt.compare(req.body.otp, userOtp.otp);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect OTP" });
        }

        // Nếu OTP đúng, account hoạt động
        existingUser.isVerified = true;
        await existingUser.save();

        // Xóa OTP sau khi xác thực thành công
        await Otp.findByIdAndDelete(userOtp._id);
        res.status(200).json({ message: "OTP verified successfully. Your account is now activated." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while verifying OTP" });
    }
};

exports.resendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        // Tìm user theo email
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Xóa OTP cũ (nếu có)
        await Otp.deleteMany({ user: existingUser._id });

        // Tạo và hash OTP mới
        const otp = generateOTP();
        const hashedOtp = await bcrypt.hash(otp, 10);

        // Lưu OTP mới vào DB
        const newOtp = new Otp({
            user: existingUser._id,
            otp: hashedOtp,
            expiresAt: Date.now() + parseInt(process.env.OTP_EXPIRATION_TIME),
        });
        await newOtp.save();

        // Gửi OTP qua email (HTML đẹp + tiếng Việt)
        const subject = "🔐 Mã OTP mới của bạn để xác thực tài khoản";
        const body = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2>Xin chào ${existingUser.fullname || existingUser.email},</h2>
                <p>Chúng tôi đã nhận được yêu cầu gửi lại mã OTP của bạn.</p>
                <p>Dưới đây là mã OTP mới để xác minh tài khoản:</p>
                <h2 style="color:#1a73e8; letter-spacing: 3px;">${otp}</h2>
                <p>Mã này có hiệu lực trong <strong>${parseInt(process.env.OTP_EXPIRATION_TIME) / (60 * 1000)} phút</strong>.</p>
                <br>
                <p>Nếu bạn không yêu cầu gửi lại OTP, vui lòng bỏ qua email này.</p>
                <p>Trân trọng,</p>
                <p>Đội ngũ hỗ trợ <strong>${process.env.APP_NAME || "Shop của chúng tôi"}</strong></p>
                <hr>
                <p style="font-size: 12px; color: #999;">Email này được gửi tự động, vui lòng không trả lời lại.</p>
            </div>
        `;

        await sendMail(existingUser.email, subject, body);

        // Sinh JWT token mới
        const secureInfo = sanitizeUser(existingUser);
        const token = generateToken(secureInfo);

        // Set token vào cookie (giống signup)
        res.cookie("token", token, {
            sameSite: process.env.PRODUCTION === "true" ? "None" : "Lax",
            maxAge: new Date(
                Date.now() +
                parseInt(process.env.COOKIE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000)
            ),
            httpOnly: true,
            secure: process.env.PRODUCTION === "true" ? true : false,
        });

        res.status(200).json({
            message: "New OTP sent successfully. Please check your email for verification.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while resending OTP, please try again later.",
        });
    }
};

exports.forgotPassword = async (req, res) => {
    let newToken;
    try {
        // checks if user provided email exists or not
        const isExistingUser = await User.findOne({ email: req.body.email })

        // if email does not exists returns a 404 response
        if (!isExistingUser) {
            return res.status(404).json({ message: "Provided email does not exists" })
        }

        await PasswordResetToken.deleteMany({ user: isExistingUser._id })

        // if user exists , generates a password reset token
        const passwordResetToken = generateToken(sanitizeUser(isExistingUser), true)

        // hashes the token
        const hashedToken = await bcrypt.hash(passwordResetToken, 10)

        // saves hashed token in passwordResetToken collection
        newToken = new PasswordResetToken({ user: isExistingUser._id, token: hashedToken, expiresAt: Date.now() + parseInt(process.env.OTP_EXPIRATION_TIME) })
        await newToken.save()

        // sends the password reset link to the user's mail
        await sendMail(
            isExistingUser.email,
            'Liên kết đặt lại mật khẩu cho tài khoản của bạn',
            `<p>Xin chào ${isExistingUser.name},</p>

            <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. 
            Nếu bạn là người đã gửi yêu cầu này, vui lòng nhấn vào liên kết bên dưới để đặt lại mật khẩu:</p>
            
            <p><a href="${process.env.ORIGIN}/reset-password/${isExistingUser._id}/${passwordResetToken}" target="_blank">Đặt lại mật khẩu</a></p>
            
            <p>Liên kết này chỉ có hiệu lực trong một khoảng thời gian nhất định. 
            Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này. 
            </p>
            
            <p>Trân trọng,<br/>
            Đội ngũ hỗ trợ <strong>${process.env.APP_NAME || "Shop của chúng tôi"}</strong></p>`
        );

        res.status(200).json({ message: `Password Reset link sent to ${isExistingUser.email}` })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error occured while sending password reset mail' })
    }
}

exports.resetPassword = async (req, res) => {
    try {

        // checks if user exists or not
        const isExistingUser = await User.findById(req.body.userId)

        // if user does not exists then returns a 404 response
        if (!isExistingUser) {
            return res.status(404).json({ message: "User does not exists" })
        }

        // fetches the resetPassword token by the userId
        const isResetTokenExisting = await PasswordResetToken.findOne({ user: isExistingUser._id })

        // If token does not exists for that userid, then returns a 404 response
        if (!isResetTokenExisting) {
            return res.status(404).json({ message: "Reset Link is Not Valid" })
        }

        // if the token has expired then deletes the token, and send response accordingly
        if (isResetTokenExisting.expiresAt < new Date()) {
            await PasswordResetToken.findByIdAndDelete(isResetTokenExisting._id)
            return res.status(404).json({ message: "Reset Link has been expired" })
        }

        // if token exists and is not expired and token matches the hash, then resets the user password and deletes the token
        if (isResetTokenExisting && isResetTokenExisting.expiresAt > new Date() && (await bcrypt.compare(req.body.token, isResetTokenExisting.token))) {

            // deleting the password reset token
            await PasswordResetToken.findByIdAndDelete(isResetTokenExisting._id)

            // resets the password after hashing it
            await User.findByIdAndUpdate(isExistingUser._id, { password: await bcrypt.hash(req.body.password, 10) })
            return res.status(200).json({ message: "Password Updated Successfuly" })
        }

        return res.status(404).json({ message: "Reset Link has been expired" })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error occured while resetting the password, please try again later" })
    }
}

exports.logout = async (req, res) => {
    try {
        res.cookie('token', {
            maxAge: 0,
            sameSite: process.env.PRODUCTION === 'true' ? "None" : 'Lax',
            httpOnly: true,
            secure: process.env.PRODUCTION === 'true' ? true : false
        })
        res.status(200).json({ message: 'Logout successful' })
    } catch (error) {
        console.log(error);
    }
}

exports.checkAuth = async (req, res) => {
    try {
        if (req.user) {
            const user = await User.findById(req.user._id)
            return res.status(200).json(sanitizeUser(user))
        }
        res.sendStatus(401)
    } catch (error) {
        console.log(error);
        res.sendStatus(500)
    }
}