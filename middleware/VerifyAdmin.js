const { verifyToken } = require('./VerifyToken')

exports.verifyAdmin = async (req, res, next) => {
  try {
    // First verify the token
    await new Promise((resolve, reject) => {
      verifyToken(req, res, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })

    // Then check if user is admin
    if (req.user && req.user.isAdmin === true) {
      next()
    } else {
      return res.status(403).json({
        message: "Access denied. Admin privileges required."
      })
    }
  } catch (error) {
    console.log(error)
    return res.status(401).json({
      message: "Authentication failed"
    })
  }
}
