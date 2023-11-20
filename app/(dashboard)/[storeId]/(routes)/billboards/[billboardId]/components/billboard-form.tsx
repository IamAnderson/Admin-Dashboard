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
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { UseOrigin } from "@/hooks/use-origin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const formSchema = z.object({
  label: z.string().min(1),
  imgUrl: z.string().min(1),
});

interface BillboardFormProps {
  initialData: Billboard | null;
}

type BillboardFormvalues = z.infer<typeof formSchema>;

const BillboardForm: React.FC<BillboardFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const origin = UseOrigin();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toastMessage = initialData
    ? "Billboard updated."
    : "Billboard created.";
  const action = initialData ? "Save changes." : "Create";

  const form = useForm<BillboardFormvalues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      imgUrl: "",
    },
  });

  const onSubmit = async (data: BillboardFormvalues) => {
    try {
      setLoading(true);

      if(initialData) {
        await axios.patch(`/api/stores/${params?.storeId}/billboards/${params.billboardId}`, data);
      }else {
        await axios.post(`/api/stores/${params?.storeId}/billboards`, data);
      };

      
      router.refresh();
      toast.success(toastMessage);

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

      await axios.delete(`/api/stores/${params?.storeId}/billboards/${params.billboardId}`);

      router.refresh();
      toast.success("Billboard deleted.")
      router.push("/");

    } catch (error) {
      console.log(error);

      toast.error("Make sure you remove all categories using this billboard first");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  if (loading) {
    toast.loading("Please wait.", { id: "loading_id_1" });
  } else if (!loading) {
    toast.remove("loading_id_1");
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading
          title={initialData ? "Edit Billboard" : "Create Billboard"}
          description={initialData ? "Edit a billboard" : "Add a new billboard"}
        />

        {initialData && (
          <Button
            disabled={loading}
            variant={"destructive"}
            size={"icon"}
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="imgUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel> Background Image </FormLabel>
                <FormControl>
                  <ImageUpload
                  value={field.value ? [field.value] : []}
                  disabled={loading}
                  onChange={(url) => field.onChange(url)}
                  onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Label </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Billboard label"
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
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />
    </>
  );
};

export default BillboardForm;
