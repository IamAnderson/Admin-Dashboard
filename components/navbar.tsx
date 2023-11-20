import { UserButton, auth } from "@clerk/nextjs";
import React from "react";
import { MainNav } from "./main-nav";
import StoreSwitcher from "./store-switcher";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";

const Navbar = async() => {
    const { userId } = auth();
    const userID = userId as string;

    if(!userId) {
        redirect("/sign-in")
    };

    const stores = await prismadb.store.findMany({
        where: {
            userId: userID
        }
    });

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div>
          <StoreSwitcher items={stores} />
        </div>

        <div>
          <MainNav className="ml-6" />
        </div>

        <div className="ml-auto flex items-center space-x-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
