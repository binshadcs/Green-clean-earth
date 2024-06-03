"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Country, State, City } from "country-state-city";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import NavigationBar from "@/components/navigationBar";
import Footer from "@/components/footer";

const formSchema = z.object({
  category: z.string(),
  name: z.string().max(255),
  location: z.string().max(255),
  coname: z.string().max(255),
  wnumber: z.coerce.number(),
  profession: z.string().max(255),
  country: z.string(),
  state: z.string(),
  district: z.string(),
  lsgdzone: z.string().max(255),
  username: z.string().max(255),
  password: z.string().max(255),
});

const categories = [
  { label: "NGO", value: "ngo" },
  { label: "School", value: "school" },
  { label: "Residence Association", value: "res_ass" },
  { label: "Promoter", value: "promoter" },
];

const countryName = (countryCode) => {
  const country = Country.getCountryByCode(countryCode);
  return country ? country.name : '';
};

const stateName = (countryCode, stateCode) => {
  const state = State.getStateByCodeAndCountry(stateCode,countryCode );
  return state ? state.name : '';
};

const Register = () => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      name: "",
      coname: "",
      wnumber: 0,
      profession: "",
      country: "",
      state: "",
      city: "",
      lsgdzone: "",
      username: "",
      password: "",
    },
  });

  const handleCountryChange = (value) => {
    setSelectedCountry(value);
    form.setValue("country", value);
    const states = State.getStatesOfCountry(value).map((state) => (
      state.isoCode !== "KL" ?
      <SelectItem key={state.isoCode} value={state.isoCode}>
        {state.name}
      </SelectItem>:''
    ));
    setStateOptions(states);
    setCityOptions([]); // Reset city options when the country changes
  };

  const handleStateChange = (value) => {
    form.setValue("state", value);
    const cities = City.getCitiesOfState(selectedCountry, value).map((city) => (
      <SelectItem key={city.isoCode} value={city.name}>
        {city.name}
      </SelectItem>
    ));
    setCityOptions(cities);
  };

  const countryOptions = Country.getAllCountries().map((country) => (
    country.isoCode !== "IN"?
    <SelectItem key={country.isoCode} value={country.isoCode}>
      {country.name}
    </SelectItem>:''
  ));

  function onSubmit(values) {

    const mappedValues = {
      ...values,
      state: stateName(values.country, values.state),
      country: countryName(values.country),
    };
    console.log(mappedValues);
  }

  return (
    <section className="bg-green-50 dark:bg-gray-900">
      <NavigationBar />
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0 mt-4">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create a group account
            </h1>
            <Form {...form}>
              <form
                noValidate
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="coname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coordinator name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="wnumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Whatsapp number</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="profession"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profession</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select onValueChange={handleCountryChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem key={"IN"} value={"IN"}>
                            {"India"}
                        </SelectItem>
                          {countryOptions}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <Select onValueChange={handleStateChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a state" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem key={"KL"} value={"KL"}>
                          {"Kerala"}
                        </SelectItem>
                          {stateOptions.length > 0 ? stateOptions : <SelectItem value="other">Other</SelectItem>}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a city" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cityOptions.length > 0 ? cityOptions : <SelectItem value="other">Other</SelectItem>}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lsgdzone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LSGD / Zone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit"  className="bg-green-500 hover:bg-green-600 text-white">Submit</Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default Register;
