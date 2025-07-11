const crypto = require("crypto");

// This matches the hashPassword function in AuthContext
const hashPassword = (password) => {
  const saltedPassword = password + "salt_string";
  return crypto.createHash("sha256").update(saltedPassword).digest("hex");
};

console.log("Hash for admin123:", hashPassword("admin123"));
