import { ActionFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import React from "react";

/* 
    const onSubmitHandler = async (data) => {
    if (!isLoading) {
      setIsLoading(true);

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      setIsLoading(false);

      if (!response.ok) {
        console.log("error");
      } else {
        setIsSended(true);
        reset();
      }
    }
  };
  */

const TestForm = () => {
  return (
    <div>
      <Form method="post">
        <label htmlFor="email">email</label>
        <br />
        <input type="email" name="email" />
        <br />
        <label htmlFor="message">Message</label>
        <br />
        <textarea name="message"></textarea>
        <br />
        <button type="submit">Envois</button>
        <br />
      </Form>
    </div>
  );
};

export default TestForm;
