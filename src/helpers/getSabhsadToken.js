import jwt from 'jsonwebtoken';

export const getDataFromSabhasadToken = async (request) => {
    // Get the token from the Authorization header
    const token = request.headers.get('Authorization')?.split(' ')[1];

    // Check if the token is present
    if (!token) {
        throw new Error("No token provided");
    }

    try {
        // Verify the token with the secret key
        const decoded = jwt.verify(token, "sabhasadSecretKey");

        // Return the decoded user ID from the token
        return decoded.userId;  // Corrected to return userId
    } catch (error) {
        console.error("Error decoding token:", error.message);
        throw new Error("Invalid or expired token");
    }
};
