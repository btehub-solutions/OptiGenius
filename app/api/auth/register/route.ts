import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
      },
    });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
      
      // Check for common database errors
      if (error.message.includes("connect") || error.message.includes("ECONNREFUSED")) {
        return NextResponse.json(
          { error: "Database connection failed. Please ensure the database is running." },
          { status: 500 }
        );
      }
      
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          { error: "User already exists" },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Something went wrong. Please check the server logs for details." },
      { status: 500 }
    );
  }
}
