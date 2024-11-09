import jwt from "jsonwebtoken";

export const getDataFromToken = (request) => {
    try {
        // Retrieve token from headers
        const token = request.headers.get('userToken')?.split(' ')[1] || '';
        console.log("Token from headers:", token);

        if (!token) {
            console.error("No token found");
            return null;
        }

        // Verify the token
        const decodedToken = jwt.verify(token, "userSecretKey");
        console.log("Decoded Token:", decodedToken);

        return decodedToken.id;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};
