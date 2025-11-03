import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { saveReport, getUserReports } from "@/lib/auth-store";

// GET - Retrieve user's saved reports
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const reports = await getUserReports(session.user.id);
    
    return NextResponse.json({ reports }, { status: 200 });
  } catch (error: any) {
    console.error("Get reports error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Save a new report
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { reportData } = body;

    if (!reportData) {
      return NextResponse.json(
        { error: "Missing report data" },
        { status: 400 }
      );
    }

    const report = await saveReport(session.user.id, reportData);
    
    return NextResponse.json(
      { message: "Report saved successfully", report },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Save report error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
