"use client";

import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/extension/multi-select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import NavigationBar from "@/components/navigationBar";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast"

import { baseUrl } from "@/app/api/status/route";
import { fetchClubData } from "@/app/api/register/route";

const formSchema = z.object({
  value: z.array(z.string()).nonempty("Please select at least one club"),
  no_of_students: z.coerce.number(),
  total_classes: z.coerce.number().gte(1).lte(999),
  list_of_classes: z.string().min(3).max(255),
  your_coordinator: z.string().min(3).max(255),
  phoneNUmber: z.coerce.number(),
  referral_name: z.string().min(3),
});

type FormSchema = z.infer<typeof formSchema>;

const MultiSelectZod = () => {
  const [clubOptions, setClubOptions] = useState([]);
  const multiForm = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: [],
    },
  });
  const searchParams = useSearchParams();
  const groupId = searchParams.get("group_id");
  const router = useRouter();
  const { toast } = useToast()

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        console.log('call');

        const data = await fetchClubData();
        console.log(data);
        setClubOptions(data.clubs);
      } catch (error) {
        console.error("Error fetching clubs:", error);
      }
    };
    fetchClubs();
  }, []);

  const onSubmit = async (data: FormSchema) => {
    const selectedClubIds = clubOptions
      .filter((club) => data.value.includes(club.name))
      .map((club) => club.id);
    console.log(groupId)
    // const formData = new FormData();
    // formData.append("groupId", groupId);
    // formData.append("clubs", selectedClubIds.join(","));
    // formData.append("list_of_classes", data.list_of_classes);
    // formData.append("no_of_students", data.no_of_students.toString());
    // formData.append("phoneNUmber", data.phoneNUmber.toString());
    const payload = {
      groupId: parseInt(groupId),
      clubs:  selectedClubIds.toString(),  // assuming data.value contains an array of selected club IDs
      list_of_classes: data.list_of_classes.toString(), // assuming data.value contains an array of
      no_of_students: parseInt(data.no_of_students),
      phoneNUmber: data.phoneNUmber,
    };
    console.log(payload);

    try {
      const response = await fetch(`${baseUrl}/group/school/register`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      if (result) {
        toast({
          title: "Account created.",
          description: "We've created your account for you.",
        })
        router.push("/login");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Oops,Something went wrong !",
        description: "Please try again...",
      })
      console.error("Error:", error);
    }
  };

  return (
    <section className="bg-green-50">
      <NavigationBar />
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0 mt-8">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              School - Additional details
            </h1>
            <Form {...multiForm}>
              <form
                onSubmit={multiForm.handleSubmit(onSubmit)}
                className="space-y-3 grid gap-3 w-full"
              >
                <FormField
                  control={multiForm.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>List of clubs in your school</FormLabel>
                      <MultiSelector
                        onValuesChange={field.onChange}
                        values={field.value}
                      >
                        <MultiSelectorTrigger className="border border-gray-200">
                          <MultiSelectorInput placeholder="Select clubs" />
                        </MultiSelectorTrigger>
                        <MultiSelectorContent>
                          <MultiSelectorList>
                            {clubOptions.map((club) => (
                              <MultiSelectorItem
                                key={club.id}
                                value={club.name}
                              >
                                {club.name}
                              </MultiSelectorItem>
                            ))}
                          </MultiSelectorList>
                        </MultiSelectorContent>
                      </MultiSelector>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={multiForm.control}
                  name="no_of_students"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of students this year</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="" {...field} />
                      </FormControl>
                      <FormDescription> </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={multiForm.control}
                  name="total_classes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total number of classes</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="" {...field} />
                      </FormControl>
                      <FormDescription> </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={multiForm.control}
                  name="list_of_classes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>List of classes</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormDescription> </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={multiForm.control}
                  name="your_coordinator"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your coordinator</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormDescription> </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={multiForm.control}
                  name="phoneNUmber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="" {...field} />
                      </FormControl>
                      <FormDescription> </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={multiForm.control}
                  name="referral_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Referral name</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormDescription> </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="bg-green-600">
                  Submit
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MultiSelectZod;
