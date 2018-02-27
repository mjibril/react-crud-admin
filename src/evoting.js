import React from 'react';
import Admin from './admin.js';
import Form from "react-jsonschema-form";
import _ from 'lodash';
import moment from 'moment';

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

    window.SERVER="http://localhost:5984";
    window.ELECTION="NIM2017";


export const default_headers = new Headers();
default_headers.set('Content-Type', 'application/json');
default_headers.set('Accept', 'application/json');
    let candidate={ type: "object",
		    required :["name","_id"],
		    properties : {
			type:  {type: "string", title: "Type",default:"candidate"},
			photo: {type : "string",title:"Photo Path",pattern : "^/"},
			name:  {type: "string", title: "Name"},
			_id :  {type: "string", title: "ID"} ,
			extra: { type: "object",
				 properties : { header : {type :"string",title: "Extra Header",default:""}
					      }
				 
			       }
		    }
		  };
    let candidates={type : "array",
		    items:  candidate
		    
		   };
    let position= {
	type: "object",
	properties: {
	    _id :{type: "string", title: "Position ID"},
	    name:  {type: "string", title: "Name"},
	    type : {type: "string",title: "Type",default:"position"},
	    vacancy : {type: "number",title: "Vacancy",default:1},
	    candidates:candidates
	    
	}
	
    };
    let positions={ type : "array",
		    items : position
		  };
    
    let selection_group={
	type: "object",
	required: ["_id","type","stop","start","priority"],
	properties:
	{
	    _id :{type: "string", title: "ID"},
	    name:  {type: "string", title: "Name"},
	    type : {type: "string",title: "Type",default:"selection_group"},
	    stop: {type: "string", title: "Stop Date and Time"},
	    start: {type: "string", title: "Stop Date and Time"},
	    priority:  {type: "number", title: "Priority"},
	}

    };
    let selection_groups ={ type: "array",
			    title : "Selection Groups",
			    items: selection_group  };
							   

						 
    let restriction ={
				   type :"object",
				   properties :
				   {
				       reason : {type : "string",title: "Reason"},
				       type : {type : "string",title: "Type"},
				       selection_groups : {
					   type : "array",title: "Affected Selection Group IDs",items: {type: "string" }
				       }
				   },
	max_number : {type : "number",title:"Maximum Number"}
    };

    let restrictions= {type : "array",
		       items:  restriction};
    
				       

    let leave_trail={type : "object", title: "Leave Trail",
					      properties: {
                                                  active : {type: "boolean",title: "Active",default:true},
						  send_serial_to_voter : {type: "boolean",title: "Send Serial to Voter",default:true},
						  
					      }
					      
		    };
					     

    let customer ={ type : "object",
		    properties:
		    {
			logo : {type: "string",title: "Logo Path",pattern: "^/"},
			abbrev : {type: "string",title: "Abbreviation"},
			name: {type: "string",title: "Name"},
		    }
		  };
		    
     let helpline_contact={ type : "object",
		    properties:
		    {
			email : {type: "string",title: "Email"},
			organisation : {type: "string",title: "Organisation"},
			phone: {type: "string",title: "Phone"},
		    }
		  }
		  
    let helpline_contacts={ type : "array",
			     items : helpline_contact};

export default class Election extends Admin
{
    
    name='Election'
    name_plural='Elections'
    list_display_links=['_id','customer.name']
    list_per_page=50
    /*
    header_transforms={
	"emails[0]" :  label => 'Email',
	"phones[0]" :  label => 'Phone',
	"id": label => "Membership No",

	}
    
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
	}*/


										    
    schema = {
	title: this.name,
	    type: "object",
	    required: ["_id","election"],
	    properties: {
		_id: {type: "string", title: "Election ID",pattern: "[A-Z0-9]+"},
		customer : customer,
		election: {type : "object" ,title :"Election",
			   properties :
			   {

			       start_date : {type: "string", title: "Start Date",pattern: "[0-9]{8}"},
			       type: { type: "string", title: "Configuration",default: "configuration"},
			       
			       
			       restrictions : {type :"array" ,title: "Restrictions", items: restriction},
			       grace_minutes: {type : "number",title: "Grace Minutes",default:0},
			       enforce_selection: {type : "boolean",title: "Enforce Selection",default:true},
			       logout_after_cast: {type : "boolean",title: "Log Voter After Casting",default:true},
			       timezone: {type : "string",title: "Time Zone",default:"Africa/Lagos",pattern: "[A-Za-z]+/[A-Za-z]"},
			       pre_send_token: {type : "boolean",title: "Pre Send Token",default:"Africa/Lagos",default:true},
			       leave_trail : leave_trail,
			       selection_groups:   selection_groups    
						       
			       
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
//	this.get_queryset();

    }
    get_list_display()
    {

	return ['_id','customer.name']
    }
    
    sort_by(fields,queryset)
    {
	return []
    }
    search(term,queryset)
    {
	let query={"selector":{"$or":
	    [
		{
		    "_id" : {
			"$regex" : "(?i)"+term
		    }
		}
	
	    ]
	

	},
//	    "fields" : ["_id","_rev","id","names","phones","emails","allowed","type"],

	}
	
	let path=SERVER+'/evoting/_find'
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

		    app.setState({queryset: results.docs.filter((row)=>{ return row.type=='configuration'}).map((row)=>{ return row}) ,total: 100    });
		    
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


	let path=SERVER+'/evoting/_all_docs?include_docs=true';
	console.log(path)
	let app=this;
	this.show_progress();
	fetch(path,{
	    method : 'get',
	}).then((response)=>{
	    console.log(response)
	    if(response.ok)
	    {
		response.json().then((results)=>
				     {


					 this.hide_progress();
					 app.setState({queryset: results.rows.map((row)=>{ return row.doc}).filter(doc => doc.type =="configuration") ,total: results.total_rows     });
					 
		});
	    }
	    else
	    {

		console.log(response);
	    }
	}).catch(error => console.log(error));
	
	
	return queryset;
    }
    get_form(object=null)
    {
	


	
	let hidden={"ui:widget": "hidden"};
	let readonly={"ui:readonly":"true"};
	const uiSchema =  {
	    id: readonly,
	    names: readonly,
	    emails: readonly,
	    phones: readonly
	    }

            

	
	if(!object)
	{
	    
	    return <Form schema={this.schema}  onSubmit={this.form_submit} liveValidate/>
	}
	else
	{

	        return <Form schema={this.schema}  formData={object} onSubmit={this.form_submit}  liveValidate/>
	}
    }

	
    form_submit(form)
    {
	let voter=form.formData;


	let path=SERVER+'/voters/'+voter['_id'];

	console.log(path);
	
	let url=form.edit ? path+'?rev='+voter['_rev'] : path;
	let method=form.edit ? 'put' : 'post';
	console.log(url)
	fetch(url,{
	    method : method,
	    body: JSON.stringify(voter)
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
