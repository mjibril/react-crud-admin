import React from "react";
import Admin from "./admin.js";
import Form from "react-jsonschema-form";
import "../css/main.css";
export default class Example extends Admin {
  constructor() {
    super();
    this.name = "Contact";
    this.name_plural = "Contacts";
    this.list_display_links = ["name"];
    this.list_display = ["name", "number", "address.street"];
  }
  get_queryset() {
    return [
      {
        id: 1,
        name: "Ken Next",
        number: "08939303003",
        address: { street: "Hallmark Street" }
      },
      {
        id: 2,
        name: "Isa Yoll",
        number: "0908839202",
        address: { street: "Barbican Street" }
      }
    ];
  }
  get_form(object = null) {
    let schema = {
      title: this.name,
      type: "object",
      required: ["name"],
      properties: {
        id: {
          type: "number",
          title: "id",
          default: Math.floor(1000 * Math.random()) + 1
        },
        name: { type: "string", title: "Name", default: "" },
        number: { type: "string", title: "Number", default: "" },
        address: {
          type: "object",
          title: "Address",
          properties: {
            street: { type: "string", title: "Street" }
          }
        }
      }
    };
    if (!object) {
      return <Form schema={schema} />;
    } else {
      return <Form schema={schema} formData={object} />;
    }
  }
}
