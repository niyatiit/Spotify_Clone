import jwt from "jsonwebtoken";

const authArtist = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.json({ success: false, message: "Please First login " });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "artist") {
      return res.json({
        success: false,
        message: "You don't have access to create the music",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.log("Auth Artist Error : ", error);
  }
};

const authUser = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({
      success: false,
      message: "Please First Login You are unothorized",
    });
  }

  const decoded = jwt.verify(token , process.env.JWT_SECRET);

  if(decoded.role !== "user" && decoded.role !== "artist"){
    return res.json({
      success: false,
      message: "You don't have access to create the music",
    });
  }

};
export  {authArtist , authUser};
