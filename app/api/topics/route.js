import connectMongodb from "@/libs/mongodb";
import Topic from "@/models/topic";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const requestData = await request.text();

    const { title, description } = JSON.parse(requestData);

    // Ensure that title and description are present in the request body
    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required." },
        { status: 400 }
      );
    }

    await connectMongodb();
    await Topic.create({ title, description });

    return NextResponse.json({ message: "Topic Created" }, { status: 201 });
  } catch (error) {
    console.error("Error in POST request:", error);

    // Return a meaningful error response
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  await connectMongodb();
  const topics = await Topic.find();
  return NextResponse.json({ topics });
}

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  await connectMongodb();
  await Topic.findByIdAndDelete(id);
  return NextResponse.json({ message: "Topic deleted" }, { status: 200 });
}
