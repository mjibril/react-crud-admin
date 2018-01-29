import React from 'react';
import Form from "react-jsonschema-form";
import _ from 'lodash';
import Admin from "./admin.js";
import moment from 'moment';

class Example extends Admin
{
    constructor()
    {
	super()
	this.name='Example';
	this.list_display_links=['name'];
	this.get_queryset=this.get_queryset.bind(this);;
	this.extra_fields= { 'now': (object,label) => moment(new Date()).format('LLL') }
	this.field_transforms = {
	
	    "name" : function(name){
		return _.lowerCase(name);
	    }}
	this.is_object_equal = (a,b) => a.id == b.id
	
    }

    sort_by(sort_fields)//from adminjs
    {

	
	let item =sort_fields[sort_fields.length-1]
	
	let pairs=_.toPairs(item);
	let field_names=pairs.map(item => item[0]);
	let field_orders=pairs.map(item => item[1]);
	
	
	return  _.orderBy(this.state.queryset,field_names,field_orders);
    }

    search(term)
    {
	
	let queryset=[];
	for(var object of this.state.queryset)
	{
	    if(object.name.search(new RegExp(term,"i"))>=0)
	    {
		queryset.push(object)

	    }
	    
	}
	return queryset;
    }
    get_list_display()
    {

	return ['name','number','address.street','now']
    }

    get_queryset()
    {
	return [
	    {id: 1, name: 'Joe Next', number: '08939303003',address:{ street: "Hallmark Street"}},
            {id: 2,name: 'Isa Yoll', number: '0908839202',address:{ street: "Barbican Street"}}
	]
	    
    }
    get_form(object=null)
    {
	

	
	let schema = {
	    title: this.name,
	    type: "object",
	    required: ["name"],
	    properties: {
		id: {type: "number", title: "id", default: Math.floor(1000*Math.random())+1 },
		name: {type: "string", title: "Name", default: ""},
		number : {type: "string", title: "Number", default: ""},
		address : {type: "object", title: "Address", properties : {
		    street : { type : "string",title : "Street"}
		}}
	    }
	};
	if(!object)
	{
	    return <Form schema={schema} onSubmit={this.submit.bind(this)} />
	}
	else
	{
	        return <Form schema={schema}  formData={object} onSubmit={this.submit.bind(this)} />
	}
    }
    submit(form)
    {
	let object=form.formData;
	

	
	if(!form.edit)
	{
	    this.state.queryset.push(object);
	    this.setState({queryset: this.state.queryset});
	}
	else
	{

	}

    }

}
export default Example;
