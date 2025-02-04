import jwt from "jsonwebtoken";

export const getDataFromToken = (request) => {
    try {
        const token = request.cookies.get("userToken")?.value || '';

        if (!token) {
            console.error("No token found in cookies");
            return null;
        }

        console.log("Token from cookies:", token);

        const decodedToken = jwt.verify(token, process.env.USER_TOKEN_SECRETE);
        console.log("Decoded Token:", decodedToken);

        return decodedToken.userId; // FIXED: Returning `userId` instead of `id`

    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};
