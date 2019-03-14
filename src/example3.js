import React from "react";
import Admin from "./admin.js";
import Form from "react-jsonschema-form";
import moment from "moment";
import "../css/main.css";
var data = [
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
export default class Example extends Admin {
  constructor() {
    super();
    this.name = "Contact";
    this.name_plural = "Contacts";
    this.list_display_links = ["name"];
    this.list_display = ["name", "number", "address.street", "now"];
  }
  get_queryset() {
    return data;
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
      return <Form schema={schema} onSubmit={this.form_submit.bind(this)} />;
    } else {
      return (
        <Form
          schema={schema}
          formData={object}
          onSubmit={this.form_submit.bind(this)}
        />
      );
    }
  }
  get_header_transforms() {
    return {
      name: function(header) {
        return "Contact " + header;
      }
    };
  }
  get_field_transforms() {
    return {
      name: function(content, object) {
        return content.toLowerCase();
      }
    };
  }
  get_extra_fields() {
    return {
      now: function(object, label) {
        return moment(new Date()).format("LLL");
      }
    };
  }
  get_actions() {
    return {
      delete: selected_objects => {
        let total = data.length;
        for (let object of selected_objects) {
          data.splice(data.indexOf(object), 1);
        }
        this.set_queryset(data);
        this.set_total(total - selected_objects.length);
      }
    };
  }
  form_submit(form) {
    let contact = form.formData;

    if (form.edit) {
      this.state.queryset.splice(
        this.state.queryset.indexOf(this.state.object),
        1,
        contact
      );
      this.response_change();
    } else {
      this.state.queryset.push(contact);
      this.response_add();
    }
  }
}
