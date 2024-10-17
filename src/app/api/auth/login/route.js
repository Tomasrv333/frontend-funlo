import { NextResponse } from 'next/server';

export async function POST(req) {
    const body = await req.json();
    const { email, password } = body;

    const apiUrl = `${process.env.API_URL}/users/login`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
    
        const data = await response.json();

        if (response.ok) {
            return NextResponse.json({ status: data.status, message: data.message }, { status: 200 });
        } else {
            return NextResponse.json({ status: data.status, message: data.message }, { status: response.status });
        }
    } catch(error) {
        return NextResponse.json({ status: response.status, message: response.message }, { status: response.status });
    }
}