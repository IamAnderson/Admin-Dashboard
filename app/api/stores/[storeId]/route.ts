import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: {storeId: string} }) {
  try {
    const userId = auth()?.userId;

    const body = await req.json();
    console.log("[BODY]",body)
    const { name } = body;

    if(!userId) {
        return new NextResponse("unauthorized", { status: 401 });
    };

    if(!name) {
        return new NextResponse("Name is required", { status: 400 })
    };

    if(!params.storeId) {
        return new NextResponse("Store id is required", { status: 400 })
    };

    console.log("[DELETE_PARAMS]", params)

    const store = await prismadb.store.updateMany({
        where: {
            id: params.storeId,
            userId
        },
        data: {
            name
        }
    });
    
    return NextResponse.json(store, { status: 200 });

  } catch (error) {
    console.log("[STORES_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export async function DELETE(_req: Request, {params}: { params: {storeId: string} }) {
    try {
      const userId = auth()?.userId;
  
      if(!userId) {
          return new NextResponse("unauthorized", { status: 401 });
      };
  
      if(!params.storeId) {
          return new NextResponse("Store id is required", { status: 400 })
      };
  
      console.log("[PATCH_PARAMS]", params)
  
      const store = await prismadb.store.delete({
          where: {
              id: params.storeId,
              userId
          }
      });
      
      return NextResponse.json(store, { status: 200 });
  
    } catch (error) {
      console.log("[STORES_PATCH]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  };
