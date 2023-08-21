"use client";

import { useCaseSwapper } from "@/lib/useCaseSwapper";
import { useLoadingMessages } from "@/lib/useLoadingMessages";
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const FormSchema = z.object({
  search: z
    .string()
    .min(2, {
      message: "Search must be at least 2 characters long"
    })
    .max(100, {
      message: "Easy tiger. 100 characters is quite enough"
    })
});

const ResultSchema = z.object({
  type: z.string(),
  value: z.string(),
  example: z.string()
});

export type TResult = z.infer<typeof ResultSchema>;

export interface SearchFormProps {
  className?: string;
}

export const SearchForm = ({ className = "", ...props }: SearchFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>();
  const { message, startMessages, stopMessages } = useLoadingMessages();

  const submitText = useCaseSwapper("Submit", 450);
  const searchAgainText = useCaseSwapper("Search Again", 450);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      search: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    setResult(undefined);
    startMessages();

    // post to /api/check
    const reply = await fetch("/api/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    });

    const json = await reply.json();
    setResult(json);

    stopMessages();
  };

  return (
    <div className={classNames("", className)} {...props}>
      <AnimatePresence mode="wait">
        {isLoading && (
          <>
            {message && (
              <motion.div
                key="message"
                className="funkytext text-3xl font-bold flex items-center justify-center py-6 mx-auto text-purple-700"
                initial={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {message}
              </motion.div>
            )}

            {result?.results && (
              <motion.div initial={{ opacity: 0 }} exit={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start pb-10">
                  {result.results.map((result: TResult, i: number) => {
                    const { value, example, type } = result;
                    let color = "bg-gray-400";
                    let icon: string = "";

                    if (type === "profanity") icon = "🤬";
                    if (type === "violence") icon = "🔫";
                    if (type === "nudity") icon = "🍆";
                    if (type === "scary") icon = "👻";

                    if (value === "None") color = "bg-pink-400";
                    if (value === "Mild") color = "bg-yellow-400";
                    if (value === "Moderate") color = "bg-red-600";
                    if (value === "Severe") color = "bg-red-900";

                    return (
                      <div
                        key={`result-${i}`}
                        className={classNames(
                          "flex flex-col items-center justify-center gap-4",
                          "bg-opacity-20 rounded-md p-4",
                          "border border-slate-400",
                          color,
                          className
                        )}
                        {...props}
                      >
                        <h1 className="flex flex-col gap-0">
                          <span className="text-2xl">{icon}</span>
                          <span className="text-4xl font-bold">{type}</span>
                        </h1>
                        <span className={classNames("font-bold uppercase p-1 rounded-lg px-2 text-sm", color)}>
                          {value}
                        </span>
                        <span>{example || "No example found"}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    onClick={() => setIsLoading(false)}
                    className="funkytext text-3xl font-bold flex items-center justify-center py-6 mx-auto"
                  >
                    {searchAgainText}
                  </Button>

                  {result.url && (
                    <a href={result.url} rel="noopener noreferrer" target="_blank" className="text-blue-600 underline">
                      View on IMDB
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </>
        )}

        {!isLoading && (
          <motion.div key="form" initial={{ opacity: 0 }} exit={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="search"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enter your movie/show name</FormLabel>
                      <FormControl>
                        <Input placeholder="Forrest Gump" {...field} className="text-center py-8 text-lg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="funkytext text-3xl font-bold flex items-center justify-center py-6 mx-auto"
                  style={{ width: 100, height: 60 }}
                >
                  {submitText}
                </Button>
              </form>
            </Form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
