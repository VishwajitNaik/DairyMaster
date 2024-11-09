import Jwt from "jsonwebtoken";

export const getDataFromToken = (request) => {
    try {
        
        const token = request.cookies.get("sanghToken")?.value || '';
        const decodedToken = Jwt.verify(token, "sanghSecurityKey");
        return decodedToken.id;

    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};
