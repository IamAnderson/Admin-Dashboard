"use client";

import { useState } from "react";
import { UseStoreModal } from "@/hooks/use-store-modal";
import Modal from "../ui/modal";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1),
});

export const StoreModal = () => {
  const storeModal = UseStoreModal();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async(values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      console.log(values)

      const res = await axios.post("/api/stores", values);
      
      toast.success("Store created.");

      if(res?.status === 201){
        return window.location.assign(`/${res.data?.id}`);
      };

    } catch (error) {
      console.log(error);

      toast.error("Something went wrong.");
    }finally{
      setLoading(false);
    }
  };

  if(loading){
   toast.loading("Creating, please wait.", {id: "loading_id_1"});
  }else if(!loading){
    toast.remove("loading_id_1");
  };

  return (
    <Modal
      title="Create store"
      description="Add a new store to manage products and categories"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div className="space-y-4 py-2 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Name </FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-6 space-x-2 flex items-center justify-end w-full"> 
              <Button disabled={loading} variant={"outline"} onClick={storeModal.onClose}> Cancel </Button>
              <Button disabled={loading} type="submit"> Continue </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};
