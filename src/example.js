import React from 'react';
import Form from "react-jsonschema-form";
import _ from 'lodash';
import Admin from "./admin.js";

class Example extends Admin
{
    constructor()
    {
	super()
	this.name='Example';
	this.list_display_links=['name'];
	this.get_queryset=this.get_queryset.bind(this);;
    }
    componentDidMount()
    {
	// Initialize the state objects queryset and total length
 	this.setState({queryset: this.get_queryset(),total: this.get_queryset().length})
    }
    sort_by(sort_fields)
    {
	
	for(let item of sort_fields)
	{
	    let pairs=_.toPairs(item);
	    let field_names=pairs.map(item => item[0]);
	    let field_orders=pairs.map(item => item[1]);
	    this.setState({queryset : _.orderBy(this.state.queryset,field_names,field_orders)});
	}
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
	if(queryset)
	{
	    this.setState({ queryset: queryset,total: queryset.length});
	}
    }
    get_list_display()
    {

	return ['name','number','address.street']
    }
    get_ordering()
    {

	return ['number']
    }
    get_queryset()
    {
	return [
	    { name: 'Joe Next', number: '08939303003',address:{ street: "Hallmark Street"}},
            {name: 'Isa Yoll', number: '0908839202',address:{ street: "Barbican Street"}}
	]
	    
    }
    get_form(object=null)
    {
	

	
	let schema = {
	    title: this.name,
	    type: "object",
	    required: ["name"],
	    properties: {
		name: {type: "string", title: "Name", default: ""},
		number : {type: "string", title: "Number", default: ""},
		address : {type: "object", title: "Address", properties : {
		    street : { type : "string",title : "Street"}
		}}
	    }
	};
	if(!object)
	{
	    return <Form schema={schema} />
	}
	else
	{
	        return <Form schema={schema}  formData={object}/>
	}
    }
}
export default Example;
