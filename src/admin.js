import React from 'react';
import _ from 'lodash';
import Set from './set';
import './admin.scss';
const displayType = {
    list : "list",
    change : "change"
    };
/**
 * ReactAdmin Class. This 
 */
export default class Admin extends React.Component {
    name='default'
    name_plural='defaults'
    live_search=false
    field_transforms={}
    header_transforms={}
    extra_fields={}
    list_display=[]
    list_display_links=[]
    ordering=[]
    list_per_page=2
    _sort_fields=[]
    is_object_equal=(a,b)=> a==b 
    actions={
	    "delete" : (selected_objects)=>{
		
	    }
	}
	    
    
    _all_selected=false
   
	
    constructor(props)
    {
	super(props);
	
	
	this.state = {displayType : displayType.list , total: 0,  page_number : 1,object : null,queryset:[],selected_objects:new Set([],this.is_object_equal)}
	
	this._handle_search = this._handle_search.bind(this);
	this.select_all = this.select_all.bind(this);
	this.select_one=this.select_one.bind(this);
	
    }
    /**
     * This function returns an array of objects that will serve as the
     * queryset for the Admin class. Typically involves an HTTP request
     * to a backend.
     * @param {} None 
     * @returns {array} An array of objects.
     */
    
    get_queryset(page_number=this.state.page_number,list_per_page=this.list_per_page)
    {


	return []
    }
    
    /**
     * This functions returns a JSON Schema object describing the Schema of 
     * the objects in the array returned by getQueryset(). Learn more on JSON Schema
     * https://spacetelescope.github.io/understanding-json-schema/
     * @param {object} The object.
     * @returns {object} A JSON Schema object.
     */

    get_form(obj=null)
    {
	
	return {}
    }
    get_ordering()
    {
	if(this.ordering)
	{
	    return this.ordering;
	}
	
	return []
    }
    get_actions()
    {
	if(this.actions)
	{
	    return this.actions;
	}
	
	return []


    }
    get_list_display_links()
    {
	if(this.list_display_links)
	{
	    return this.list_display_links;
	}
	return [];
    }
    get_list_display()
    {
	if(this.list_display)
	{
		return this.list_display;

	}
	return []
	
    }
    _get_ordered_queryset()
    {
	
	if(this.get_ordering())
	{
	   let ordering= this._sort_fields.length >=1  ? this._sort_fields : this.get_ordering();
	   return  this.state.queryset 
	}
	//return this.get_queryset();
	return this.state.queryset
	
    }
    
    search(term)
    {
	//
    }

    has_delete_permission(object)
    {
	
        return true
    }
    has_add_permission()
    {
	return true;
    }
    has_change_permission(object=null)
    {
	return true
    }
    has_module_permission()
    {
	return true
    }
    /*
    _order_state(field)
    {

	let index=_.findIndex(this._sort_fields,item=> item.hasOwnProperty(field));
	
	if(index<0)
	{
	    return 'sort-not-active';

	}
	if(this._sort_fields[index][field]=='desc')
	{
	   
	    return 'sort-reverse-active';
	}
	return 'sort-active';
    }*/
    _order_state_arrow(field)
    {

	let index=_.findIndex(this._sort_fields,item=> item.hasOwnProperty(field));
	
	if(index<0)
	{
	    return null;

	}
	if(this._sort_fields[index][field]=='desc')
	{
	   
	    return <span>&#8681;</span>
	}
	return  <span> &#8679;</span>
    }
    
    response_add(options)
    {
	
	this.setState({displayType :displayType.list, object :null  });
	this.get_queryset();
	return true
    }
    response_change(options)
    {

	this.setState({displayType :displayType.list, object :null  });
	this.get_queryset();
	return true
    }

    _create_object_link(object,label)
    {
	if(this.has_change_permission(object))
	{
	    return <a onClick={this._object_link_clicked(object)} href="#"> {label} </a>
	}
	else
	{
	    return <span> {label} </span>
	}
    }
    _get_prop_label(label)
    {
	let labels=label.split('.');
	return labels[labels.length-1];
    }
    _get_table_header()
    {
	return this.get_list_display().map((item)=>
	{
		return <th key={item}  onClick={this._sort_handler(item)} > { this.header_transforms[item] ? this.header_transforms[item](item): _.startCase(this._get_prop_label(item))}{    this._order_state_arrow(item)} </th>
	})

    }

    _object_link_clicked(object)
    {
	
	return (event)=>
	{
	    this.setState({displayType :displayType.change, object :object  });
	    event.preventDefault();
	}
    }

    _display_field(object,item)
    {
	let label=_.at(object,item)
	
	if(_.has(this.field_transforms,item))
	{
	    return this.field_transforms[item](label)

	}

	if(_.at(this.extra_fields,item))
	{
	    
	    if(this.extra_fields[item])
	    {
		label=this.extra_fields[item](object,item)
	    }
	    
	}

	return label;
    }
    _refresh_queryset(queryset)
    {
	this.setState({queryset : queryset});

    }
    sort_by(sort_fields)
    {
	
    }

    _sort_handler(field)
    {
	
	return (event)=>
	{

	    let index=_.findIndex(this._sort_fields,item=> item.hasOwnProperty(field));
	    if(index>=0)
	    {
		if(this._sort_fields[index][field]=='asc')
		{
		    this._sort_fields[index][field]='desc';

		    
		}
		else
		{
		    this._sort_fields=_.filter(this._sort_fields,item => !item.hasOwnProperty(field));
		    
		}

		
	    }
	    else
	    {
		let temp={};
		temp[field]='asc'
		this._sort_fields.push(temp);
		
	    }
	    //console.log(JSON.stringify(this._sort_fields));
	    this.sort_by(this._sort_fields)
	    this.forceUpdate();

	}
    }
    select_all(event)
    {

	//console.log(this.state.selected_objects.getItems())
	if(this._all_selected)
	{
	    
	    this.setState({selected_objects : new Set([],this.is_object_equal)});
	}
	else
	{
	    this.setState({selected_objects : new Set(this.state.queryset,this.is_object_equal)})
	    
	}
	this._all_selected=!this._all_selected;
	
    }
    select_one(object)
    {
	return (event)=>{

	    if(this.state.selected_objects.contains(object))
	    {
		this.state.selected_objects.remove(object);

		this.setState({selected_objects : this.state.selected_objects});

	    }
	    else
	    {
		this.state.selected_objects.add(object);
		this.setState({selected_objects : this.state.selected_objects});


	    }
	}
    }
    _get_table_body()
    {
	return this._get_ordered_queryset().map((object,i)=>
	    {
		return <tr>
		<td>  <input type="checkbox" id={i+'_checkbox'} onChange={this.select_one(object)} checked={this.state.selected_objects.contains(object)}/> <label htmlFor={i+'_checkbox'}>&nbsp;</label> </td>
		{this.get_list_display().map((item)=>
		{
		    
		    return <td key={item} > { this.get_list_display_links().find((a)=>{return item==a}) ? this._create_object_link(object, this._display_field(object,item)) : this._display_field(object,item)}  </td>
		    
		    })}
		</tr>
	    })


    }

    show_progress()
    {

	this.setState({loading: true});
    }
    hide_progress()
    {

	this.setState({loading: false});
    }
    _render_progress()
    {

	return 	    <div className="fetch-progress" >
	 <progress>
	    	    </progress> 
	    </div>

    }

    _handle_search(event)
    {
	let term=event.target.value;
	
	if(term)
	{
	    let key= event.which || event.keyCode;
            if(this.live_search || key==13)
	    {
		this.search(term);
	    }

	}
	else
	{
	    
	    this.setState({queryset:this.get_queryset(),total:this.get_queryset().length})
	}
	

    }
    _render_search_field()
    {

	return 	<div className="search-field">
	<input name="search" type="text" className="form-control" placeholder="Search" onChange={this._handle_search}   onKeyUp={this._handle_search}/>
	</div>

    }
    _render_add_button()
    {
	if(this.has_add_permission())
	{
		return <button className={"ra-add-button"} onClick={this._object_link_clicked(null)} > Add {_.startCase(this.name)}</button>
	}
    }
    _render_table()
    {
	return 	<table className="table">
		<thead>
	        <tr>
	         <th>  <input type="checkbox" id="all_boxes" onChange={this.select_all} />  <label htmlFor="all_boxes">&nbsp;</label> </th>
		{this._get_table_header()}
		</tr>
		</thead>
		<tbody>
		{this._get_table_body()}
		</tbody>
		</table>
	


    }


    action_selected(action)
    {
	return (event)=>{

	    this.actions[action](this.state.selected_objects);
	    this.get_queryset(this.state.page_number,this.list_per_page);
	}
	

    }
    selectPage(page)
    {
	return (event)=>
	{
	
	    this.setState({page_number: page.page},()=>{this.get_queryset()});
	    event.preventDefault();
	}



    }
    nextPage()
    {
	this.setState({page_number: Math.min(this.state.page_number+1,this.state.total)});
	    
	
    }
    prevPage()
    {
	this.setState({page_number: Math.max(this.state.page_number-1,1)});
	    
	
    }

    _render_pagination()
    {
	let pages=[];
	if(this.state.total)
	{
	    let numpages=Math.ceil(this.state.total/this.list_per_page);
	    for(var i=0;i<numpages;i++)
	    {
		pages.push(i+1);

	    }
	}

	return <div className="pull-right">
	    <span className="summary">{this.list_per_page*(this.state.page_number-1)+1 }-{Math.min(this.list_per_page*(this.state.page_number-1)+this.list_per_page,this.state.total)} of {this.state.total} </span>  

	<nav  aria-label="Page navigation">
	<ul className="pagination">
	<li>
	<a href="#" aria-label="Previous" onClick={this.prevPage}>
	<span aria-hidden="true">&laquo;</span>
	</a>
	</li>
	{pages.map((page)=>{
	    return <li><a href="#" onClick={this.selectPage({page})}>{page}</a></li>
	})
	}
	<li>
	<a href="#" onClick={this.nextPage} aria-label="Next">
	<span aria-hidden="true">&raquo;</span>
	</a>
	</li>
	</ul>
	
	</nav>
	</div>
    }
    _render_actions()
    {

	    
	return <select className="ra-action-button">
	<option value="" disabled selected>Choose an action</option>
	{ _.keys(this.actions).map((action)=>{
	    return <option value={action} onChange={this.action_selected(action)}>{_.startCase(action)}</option> 

	    })}
	</select>
	
    }
    _render_back_button()
    {
	return <div><button className={"ra-back-button"} onClick={()=>{this.setState({displayType : displayType.list,object: null })}}> Back </button></div>
	

    }
    render()
    {

	history.pushState({}, "List View", "#");
	if(this.state.displayType == displayType.list)
	{

	    return (
		<div className="list">

		{this._render_add_button()}
		{this._render_search_field()}
		{this._render_actions()}
		{this._render_table()}
		{this.state.loading ? this._render_progress() : null} 
		{this._render_pagination()}
		</div>
	    )
	    
	}
	else
	{
	    history.pushState({}, "Change View", "#/"+this.name.toLowerCase()+"/change");
	    
	    return (
		
		<div className="change-form">
		{this._render_back_button()}
		{this.get_form(this.state.object)}
		</div>
	    )
	}

	
    }
    /*
    registerListener()
    {

	window.onhashchange = (event)=> {

	    
	    let length= location.hash.length;
	    let _location= location.hash [ length-1]=='/' ? location.hash.slice(0,length-1) : location.hash;

	    
	    if(_location == this.location)
	    {

		this.setState({displayType : displayType.list})

	    };

	}
	
    }*/
    init()
    {

	//this.registerListener();
    }
}




