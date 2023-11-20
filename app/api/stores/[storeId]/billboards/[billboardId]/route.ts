import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { _: string; billboardId: string } }
  ) {
    try {
      if (!params.billboardId) {
        return new NextResponse("   Billboard id is required", { status: 400 });
      }
  
      const billboard = await prismadb.billboard.findUnique({
        where: {
          id: params.billboardId,
        },
      });
  
      return NextResponse.json(billboard, { status: 200 });
    } catch (error) {
      console.log("[BILLBOARD_GET]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const userId = auth()?.userId;

    const body = await req.json();
    console.log("[BODY]", body);
    const { label, imgUrl } = body;

    if (!userId) {
      return new NextResponse("unauthenticated", { status: 401 });
    }

    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }

    if (!imgUrl) {
      return new NextResponse("Image is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    if (!params.billboardId) {
      return new NextResponse("   Billboard id is required", { status: 400 });
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

    const billboard = await prismadb.billboard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imgUrl,
      },
    });

    return NextResponse.json(billboard, { status: 200 });
  } catch (error) {
    console.log("[BILLBOARD_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const userId = auth()?.userId;

    const body = await req.json();
    console.log("[BODY]", body);
    const { label, imgUrl } = body;

    if (!userId) {
      return new NextResponse("unauthenticated", { status: 401 });
    }

    if (!params.billboardId) {
      return new NextResponse("   Billboard id is required", { status: 400 });
    }

    if (!params.storeId) {
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

    const billboard = await prismadb.billboard.delete({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboard, { status: 200 });
  } catch (error) {
    console.log("[BILLBOARD_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

