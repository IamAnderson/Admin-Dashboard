import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();
    const { label, imgUrl } = body;

    if (!userId) {
      return new NextResponse("unauthenticated", { status: 401 });
    }

    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }

    if (!imgUrl) {
      return new NextResponse("Image URL is required", { status: 400 });
    }

    if (!params?.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params?.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("unauthorized", { status: 403 });
    }
    
    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imgUrl,
        storeId: params?.storeId,
      },
    });

    return NextResponse.json(billboard, { status: 201 });

  } catch (error) {
    console.log("[BILLBOARD_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  _: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId: params?.storeId,
      },
    });

    return NextResponse.json(billboards, { status: 201 });

  } catch (error) {
    console.log("[BILLBOARDS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
