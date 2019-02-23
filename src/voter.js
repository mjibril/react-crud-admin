import React from 'react';
require('./admin.scss');
import Admin from './admin.js';
import Form from "react-jsonschema-form";
import _ from 'lodash';
import moment from 'moment';
const uuidv1 = require('uuid/v1');

class QueryParam
{
    constructor(name='',value='',is_string=false)
    {
	this.name=name;
	this.value=value;
	this.is_string=is_string;

    }
    

}
function build_params(params)
{
    val=[]
    
    for(let param of params)
    {
        _escape= param.is_string ? '\"' : ''
        val.push(param.name+'='+_escape+param.value+_escape)
        return "?"+ _.join(val,'&')
    }

}

function build_composite_key(keys)
{
   let f= keys.map((key)=>{

       if(typeof key == "string")
       {
	   return '\"'+key+'\"';
       }
       else
       {
	   return key;
       }
	   
   });

    
    return '['+_.join(f,',')+']';
}

/*
  params=build_params(
  QueryParam("reduce","false"),
                                QueryParam("key",build_composite_key(
                                        election,
                                        token)
                                )
                        )

*/

export const default_headers = new Headers();
default_headers.set('Content-Type', 'application/json');
default_headers.set('Accept', 'application/json');
if( window.ELECTION == "undefined" || typeof window.ELECTION === "undefined" )
{
    window.SERVER="http://localhost:8000";
    window.ELECTION="demo";
}


export class Voter extends Admin
{
    
    name='Voter'
    name_plural='Voters'
    list_display_links=['id','names']
    list_per_page=50
    header_transforms={
	"emails[0]" :  label => 'Email',
	"phones[0]" :  label => 'Phone',
	"id": label => "Membership No",

    }
    extra_fields={ 'now': (object,label) => moment(new Date()).format('LLL') }
    field_transforms={
	
	"created" : function(created,object){
	    if(created)
		{
		    let c=moment(new Date(created));
		    if(c.isValid())
		    {
			return c.format('LLL');;
		    }
		    else
		    {

			return '';
		    }
		}
	    else
	    { return '';}
		
	}
    }
    schema = {
	    title: this.name,
	    type: "object",
	    required: ["names","id"],
	properties: {
	    type: {type: "string", title: "Type",default:"voter"},
		names: {type: "string", title: "Names"},
		token : {type: "object",properties:{
		    
		    token: {type:"string",default:_.join(_.sampleSize('ABCDEFGUIJKLMNPQRSTUVWXYZ123456789',8),'')},
		    expiry: {type:"string"}
		}},
	    cast: {type: "object",default: {}},
		id: {type: "string", title: "ID"},
		authorization: {type: "string", title: "Authorization",default:uuidv1()},
		phones : {type: "array", title: "Phone Numbers", items: {type : "string"} },
		emails : {type: "array", title: "Email Addresses", items: {type : "string"} },
		allowed : {type: "array",
		          title: "Allowed Elections",
		    items : { type: "object",
			properties :
			{
			    election : { type : "string","title" :"Election",default:"demo"},
			    selection_groups: { type : "array",title: "Selection Groups",items:{type:"string"}, default : ["council","south-east","south-south","south-east","north-east","south-west","north-central","north-west"]}

			}
		    }
		}
	    }
	}


    constructor()
    {
	super();
	
    }
    componentDidMount()
    {
	
	this.form_submit =this.form_submit.bind(this);
	this.response_change = this.response_change.bind(this);
	this.response_add = this.response_add.bind(this);
	//this.nextPage=this.nextPage.bind(this);
	//this.prevPage=this.prevPage.bind(this);
	//this.get_queryset();

    }
    get_list_display()
    {

	return ['id','names','created','emails','phones[0]']
    }
    
    sort_by(fields,queryset)
    {

	let path=SERVER+'/voters/_find'
	let query={selector: { 'created' : {'$ne' : null},'names' : {'$ne' : null}},sort: fields,limit:this.list_per_page,skip: (this.state.page_number-1) * this.list_per_page}
	let app=this;
	this.show_progress();
	fetch(path,{
	    method : 'post',
	    headers: default_headers,
	    body: JSON.stringify(query)
	}).then((response)=>{
	    if(response.ok)
	    {
		response.json().then((results)=>
		{
		    this.hide_progress();
		    app.setState({queryset: results.rows.filter((row)=>{ return row.type=='voter'}).map((row)=>{  return row.value}) ,total: results.total_rows     });
		    
		});
	    }
	    else
	    {

		this.hide_progress();
	    }
	}).catch(e => this.hide_progress());
	
	return [];

    }
    search(term,queryset)
    {
	let query={"selector":{"$or":
	    [
		{
		    "names" : {
			"$regex" : "(?i)"+term
		    }
		},
		{
		    "emails" : {
			"$elemMatch": {
			    "$regex" :  "(?i)"+term
			}
		    }

		},
		{
		    "id" : {
			"$regex" : "(?i)"+term

		    }
		}

	    ]
	

	},
//	    "fields" : ["_id","_rev","id","names","phones","emails","allowed","type"],

	}
	
	let path=SERVER+'/voters/_find'
	let app=this;
	this.show_progress();
	
	fetch(path,{
	    method : 'post',
	    headers: default_headers,
	    body: JSON.stringify(query)
	}).then((response)=>{
	    if(response.ok)
	    {
		
		response.json().then((results)=>
		{
		    console.log(results)
		    this.hide_progress();
		    app.setState({queryset: results.docs.filter((row)=>{ return row.type=='voter'}).map((row)=>{ return row}) ,total: 100    });
		    
		});
	    }
	    else
	    {

		this.hide_progress();
	    }
	}).catch(e => this.hide_progress());
	
	return queryset

    }
    get_queryset(page_number,list_per_page,queryset)
    {


	let path=SERVER+'/voters/_design/voter/_view/by_election?key="'+window.ELECTION+'"&reduce=false'+'&limit='+list_per_page+'&skip='+((page_number-1) * list_per_page);
	console.log(path)
	let app=this;
	this.show_progress();
	fetch(path,{
	    method : 'get',
	}).then((response)=>{
	    if(response.ok)
	    {
		response.json().then((results)=>
		{
		    this.hide_progress();
		    app.setState({queryset: results.rows.map((row)=>{ return row.value}) ,total: results.total_rows     });
		    
		});
	    }
	});
	
	
	return queryset;
    }
    get_form(object=null)
    {
	


	
	let hidden={"ui:widget": "hidden"};
	let readonly={"ui:readonly":"true"};
	const uiSchema =  {
	  //  id: readonly,
	   // names: readonly,
	   // emails: readonly,
	    // phones: readonly,
	    token : readonly,
	    authorization: hidden,
	   type: hidden
	    }

            

	
	if(!object)
	{


	    return <Form schema={this.schema}  uiSchema={uiSchema} onSubmit={this.form_submit} />
	}
	else
	{
	        return <Form schema={this.schema} uiSchema={uiSchema}  formData={object} onSubmit={this.form_submit} />
	}
    }

	
    form_submit(form)
    {
	let voter=form.formData;

	let id=voter['_id'] ? voter['_id'] : '';
	let path=SERVER+'/voters/'+id;

	console.log(path);
	
	let url=form.edit ? path+'?rev='+voter['_rev'] : path;
	let method=form.edit ? 'put' : 'post';
	console.log(url)
	
	fetch(url,{
	    method : method,
	    body: JSON.stringify(voter),
	    headers: default_headers
	}).then((response)=>{
		
	    if(response.ok)
	    {
		let action = form.edit ? this.response_change : this.response_add;

		action();
		

		
	    }
	    else
	    {

		alert(response.statusText);
	    }

		
	}).catch((response)=>{alert(response)});


    }
    has_add_permission()
    {

	return true;
    }
}
