import { NextResponse } from 'next/server';

// Dummy Users (in production, this should be in a database)
const users = [
    {id: 1, name: 'uploader1', key: 'key123'},
    {id: 2, name: 'uploader2', key: 'key456'},
];

export async function POST(req: Request) {
    const { name, key } = await req.json();
    const user = users.find(u => u.name === name && u.key === key);
    
    if (user) {
        return NextResponse.json({ success: true, user });
    }
    
    return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 403 }
    );
} 