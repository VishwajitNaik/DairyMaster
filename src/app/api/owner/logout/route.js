import { NextResponse, NextRequest } from "next/server";

export async function GET(request){
    try {
        const response = NextResponse.json({message: "Logout success.."})
        response.cookies.set("ownerToken", "", {
            httpOnly: true,
            expires: new Date(0)
        })
        console.log(response);
        return response;
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}