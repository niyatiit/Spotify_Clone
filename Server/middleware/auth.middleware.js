import jwt from "jsonwebtoken";

const authArtist = async (req, res, next) => {
  try {
    // Check for token in Authorization header (Bearer token) or cookies
    let token = req.cookies?.token;
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Please login first" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "artist") {
      return res.status(403).json({
        success: false,
        message: "You don't have access to upload music. Only artists can upload.",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.log("Auth Artist Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again."
    });
  }
};

const authUser = async (req, res, next) => {
  try {
    // Check for token in Authorization header (Bearer token) or cookies
    let token = req.cookies?.token;
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first. You are unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "user" && decoded.role !== "artist") {
      return res.status(403).json({
        success: false,
        message: "You don't have access",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.log("Auth User Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again."
    });
  }
};

const authSelfOrAdmin = async (req, res, next) => {
  try {
    // Check for token in Authorization header (Bearer token) or cookies
    let token = req.cookies?.token;
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first. You are unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const targetUserId = req.params.userId;

    // Allow if user is deleting their own account or if they have admin role (future-proofing)
    if (decoded.id !== targetUserId && decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own account",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.log("Auth Self Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again."
    });
  }
};

export { authArtist, authUser, authSelfOrAdmin };
