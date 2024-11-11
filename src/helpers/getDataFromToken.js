import Jwt from "jsonwebtoken";

export const getDataFromToken = (request) => {
    try {
        const token = request.cookies.get("ownerToken")?.value || '';
        const decodeToken = Jwt.verify(token, process.env.OWNER_TOKEN_SECRETE);
        return decodeToken.id;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};
