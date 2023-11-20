"use client";
import AlertModal from "@/components/modals/alert-modal";
import ApiAlert from "@/components/ui/api-alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { UseOrigin } from "@/hooks/use-origin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface SettingsFormProps {
  initialData: Store;
}

const formSchema = z.object({
  name: z.string().min(1),
});

type SettingsFormvalues = z.infer<typeof formSchema>;

const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const origin = UseOrigin();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<SettingsFormvalues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: SettingsFormvalues) => {
    try {
      setLoading(true);

      const res = await axios.patch(`/api/stores/${params?.storeId}`, data);

      toast.success("Store updated.");

      if (res?.status === 200) {
        router.refresh();
      }
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);

      const res = await axios.delete(`/api/stores/${params?.storeId}`);

      if (res?.status === 200) {
          router.refresh();
          router.push("/");
          toast.success("Store Deleted.");
    };
    } catch (error) {
      console.log(error);

      toast.error("Make sure you remove all products and categories first");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  if (loading) {
    toast.loading("Please wait.", { id: "loading_id_1" });
  } else if (!loading) {
    toast.remove("loading_id_1");
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title="Settings" description="Manage store preferences" />

        <Button
          disabled={loading}
          variant={"destructive"}
          size={"icon"}
          onClick={() => setOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Name </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="store name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={loading} className="ml-auto" type="submit">
            Save Changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert 
      title="NEXT_PUBLIC_API_URL" 
      description={`${origin}/api/stores/${params.storeId}`} 
      variant="public" />
    </>
  );
};

export default SettingsForm;
