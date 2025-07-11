const bcrypt = require("bcryptjs");

async function generateHash() {
  try {
    console.log("Generating bcrypt hash for password: admin123");
    const hash = await bcrypt.hash("admin123", 12);
    console.log("Generated hash:", hash);

    // Verify it works
    const isValid = await bcrypt.compare("admin123", hash);
    console.log("Verification test passed:", isValid);

    if (isValid) {
      console.log("\n✅ Use this hash in your database setup:");
      console.log(hash);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

generateHash();
