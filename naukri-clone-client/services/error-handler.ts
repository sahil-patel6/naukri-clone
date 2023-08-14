import { toast } from "@/components/ui/use-toast";

export function error_handler(err: any) {
  const errors = err?.response?.data?.errors || null;
  if (errors) {
    console.log(errors);
    toast({
      title: errors[0].message,
      variant: "destructive",
      duration: 2000,
    });
  } else {
    toast({
      title: "something went wrong!!",
      variant: "destructive",
      duration: 2000,
    });
  }
  console.log(err);
}