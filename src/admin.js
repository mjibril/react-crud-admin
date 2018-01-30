import React from 'react';
import _ from 'lodash';
import Set from './set.js';
import './admin.scss';

const displayType = {
    list : "list",
    change : "change"
};

/** Admin Class extends React.Component. To implement a CRUD interface similar to Django Admin you need to extend the Admin class. */
class Admin extends React.Component {
	
    constructor(props)
    {
	
	super(props);
	
	this.name='default'
	this.name_plural='defaults'
	this.live_search=false
	this.field_transforms={}
	this.header_transforms={}
	this.extra_fields={}
	this.list_display=[]
	this.list_display_links=[]
	this.list_per_page=10
	this.sort_fields=[]
	this.is_object_equal=(a,b)=> a==b
	
	this.actions={
	    "delete" : (selected_objects)=>{
		
	    }
	}
	
    
	this._all_selected=false

	let queryset=this.get_queryset() ? this.get_queryset() : [] ;
	this.state = {displayType : displayType.list , total: queryset.length,  page_number : 1,object : null,queryset: queryset,selected_objects:new Set([],this.is_object_equal)}
	
	this._handle_search = this._handle_search.bind(this);
	this.select_all = this.select_all.bind(this);
	this.select_one=this.select_one.bind(this);

    }
     /**
     * This function returns an array of objects that will serve as the
     * queryset for the admin interface. Typically involves an HTTP request
     * to a backend.
     *  
     * @returns {object[]} An array of objects.
     */

    get_queryset(page_number=this.state.page_number,list_per_page=this.list_per_page)
    {
    

	return []
    }

    
    /**
     * This functions returns a JSON Schema Form for editing
     * the objects in the array returned by get_queryset(). This method needs to be overridden to
     * so as to return a Form Component for the object.  Learn more on 
     * JSON schema forms from https://github.com/mozilla-services/react-jsonschema-form 
     * and JSON Schema from https://spacetelescope.github.io/understanding-json-schema/
     * @param {object} object - The current selected object.
     * @returns  A JSON Schema Form Component.
     */

    get_form(object=null)
    {
	
	return {}
    }
    /**
     * Returns a true/false value. Controls wether search is implement on live input or not.
     * Can be overriden by the live_search member variable. Default is false.
     *
     *@return {boolean} 
     */

    get_live_search()
    {
	return false
	
    }

    /**
     * Returns a true/false value. Controls wether search is implement on live input or not.
     * Can be overriden by the live_search member variable. Default is false.
     *
     *@return {boolean} 
     */

    get_field_transforms()
    {
	
	return false
	
    }
    
    /**
     * Gets an actions object whose properties are action names and values are action methods.
     * This an be overridden by the action member variable. The default "delete" method is not
     * implemented.
     *
     * @example
     * ```javascript
     * actions = { "delete" : (selected_objects)=>{ } }
     * ```
     *
     * Each actions object property (e.g. "delete") is passed an array of selected objects. One
     * can then handle those objects. Actions will appear on the list display page within a
     * dropdown. Selecting an action should have the action method applied to all currently 
     * selected objects.
     *
     *@return {object} An actions object
     */
    
    get_actions()
    {

	if(this.actions)
	{
	    return this.actions;
	}
	
	return {}


    }
    /**
     *   Gets the list/array of properties of the objects in the queryset that are clickable
     *    when displayed on the list display page. It can be overwritten by the member variable
     *   list_display_links. A property is any string that should exist in the objects within 
     * a queryset and works with lodash's _.at function. 
     *
     *   @example
     *   let object={ name : "any name",{ address : { street : "any"}},emails: ["any@any.com"]}
     *  
     *   The properties "name","address.street" and "emails[0]" are all acceptable
     *
     * @return {string[]} A list of properties of the object to be displayed
     */

    get_list_display_links()
    {

	if(this.list_display_links)
	{
	    return this.list_display_links;
	}
	return [];
    }
/**
     *   Gets the list/array of properties/field names of the objects in the queryset to be
     *   displayed on the list display page. It can be overwritten by the member variable
     *   list_display. A property is any string that should exist in the objects within 
     *   a queryset and works with lodash's _.at function. See more at
     *   https://lodash.com/docs/4.17.4#at 
     *
     *   @example
     *   let object={ name : "any name",{ address : { street : "any"}},emails: ["any@any.com"]}
     *  
     *   The properties "name","address.street" and "emails[0]" are all acceptable
     *
     * @return {string[]} A list of properties of the object to be displayed 
     */

    get_list_display()
    {
     
	if(this.list_display)
	{
		return this.list_display;

	}
	return []
	
    }
    /**
     * Returns an ordered queryset. The method checks to see if sorting is active and sorts
     * the current queryset based on the sort order. 
     * @private
     * @return {object[]} An ordered queryset 
     */


    _get_ordered_queryset()
    {

	if(this.sort_fields.length>0)
	{
	    
	    return this.sort_by(this.sort_fields) 
	}

	return this.state.queryset ?  this.state.queryset : [];

    }
    /**
     * Implements search. This method should be overridden to implement a custom search
     *
     *@param {string} term - the search term
     *@return {object[]} the queryset as a result of the search
     */

    
    search(term)
    {
	return this.state.queryset
    }
    /**
     * Grants permission to delete object. This method is not implemented and can be handled via
     *  implementing actions.
     *
     *@param {object} object - 
     *@return {boolean} Returns true is the object has been deleted or false otherwise
     */

    has_delete_permission(object)
    {
	
        return true
    }
    /**
     * Grants permission to add an object. This method controls rendering of the Add 
     * button
     *
     *
     *@return {boolean} Returns true is the object can be added or false otherwise
     */

    has_add_permission()
    {
	return true;
    }
    /**
     * Grants permission to change an object. It disables all links to the add/change page when
     * enabled
     *
     *@return {boolean} Returns true is the object can be changed or false otherwise
     */

    has_change_permission(object=null)
    {
	return true
    }
    /**
     * Grants permission to access this admin interface. 
     *
     *@return {boolean} Returns true if access is allowed false otherwise
     */

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

    /**
     * This method adds up/down arrows to field headers on the list display page table
     *
     * @private 
     * @param {strin} field -  the field/property name
     
     
     */   


    _order_state_arrow(field)
    {

	let index=_.findIndex(this.sort_fields,item=> item.hasOwnProperty(field));
	
	if(index<0)
	{
	    return null;

	}
	if(this.sort_fields[index][field]=='desc')
	{
	   
	    return <span>&#8681;</span>
	}
	return  <span> &#8679;</span>
    }
    /**
     *  This method  should be overriden and called after saving an object in the add/change view.       *  This method is not called at all here but provides hints on what to do after saving
     *  an object. Change the state displayType to "list", object to "null" and refresh the quer         *  yset.
     */   
    
    response_add(options)
    {
	
	this.setState({displayType :displayType.list, object :null,queryset: this.get_queryset()  });

	return true
    }
    /**
     *  This method should be overriden and called after saving an object in the add/change view.         *  This method is not called at all here but provides hints on what to do after saving
     *  an object. Change the state displayType to "list", object to "null" and refresh the quer         *  yset.
     */   

    response_change(options)
    {
	this.setState({displayType :displayType.list, object :null,queryset: this.get_queryset()  });
	
	return true
    }
    /**
     * A private method to wrap a table entry in an <a></a> tag in the display page.
     * The method checks if permission is given to display links using the has_change_permission method
     * @private
     * @param {object} object - the current object to be displayed as a table
     * entry in the display page
     * @param {string} label - the name of the field 
     
     */
   
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
    set_queryset(queryset)
    {
	
	this.setState({queryset : queryset,total:queryset.length})

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
	return this.state.queryset ? this.state.queryset : [];
    }

    _sort_handler(field)
    {

	return (event)=>
	{
	    
	    let index=_.findIndex(this.sort_fields,item=> item.hasOwnProperty(field));
	    if(index>=0)
	    {
		if(this.sort_fields[index][field]=='asc')
		{
		    this.sort_fields[index][field]='desc';

		    
		}
		else
		{
		    this.sort_fields=_.filter(this.sort_fields,item => !item.hasOwnProperty(field));
		    
		}

		
	    }
	    else
	    {
		let temp={}
		temp[field]='asc';
		this.sort_fields.push(temp);

	    }
	  
	    this.sort_by(this.sort_fields)
	    this.forceUpdate();

	}
    }
    /**
     * This method is an event handler that listens to when all objects of the queryset
     * displayed within a single display page are selected
     */   

    select_all(event)
    {


	
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
    /**
     * This method is an event handler that listens when a single objects of the queryset
     * displayed is selected
     */   

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

    /**
     * Generate the table body for the list display page
     *
     * @return  An array of table rows <tr/>
     */

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
    /**
     * Changes the state property "loading" to true. The state property can be used to show a
     * progress indicator.
     */

    show_progress()
    {
	  

	this.setState({loading: true});
    }
    /**
     * Changes the state property "loading" to false. This method  can be used to hide a
     * progress indicator by inspecting the "loading" property of the state object.
     */

    hide_progress()
    {

	this.setState({loading: false});
    }
    /**
     * The default progress indicator. Can be overriden.
     * @return A progress indicator component
     */

    render_progress()
    {


	return 	    <div className="fetch-progress" >
	 <progress>
	    	    </progress> 
	    </div>

    }
    /**
     * An event listener that listens to the search event. This method calls search method which
     * implements a custom search. The method uses the "live_search" property to implement live 
     * search or not.
     * @private
     * @param {object} event The search onChange event
     */

    _handle_search(event)
    {
	let term=event.target.value;
	
	if(term)
	{
	    let key= event.which || event.keyCode;
            if(this.live_search || key==13)
	    {
		let queryset=this.search(term);
		this.setState({queryset:queryset,total:queryset.length})

	    }

	}
	else
	{
	    
	    this.setState({queryset:this.get_queryset(),total:this.get_queryset().length})
	}
	

    }
    /**
     * Renders the search component
     * @private 
     * @return A search input field
     */

    _render_search_field()
    {
	return 	<div className="search-field">
	<input name="search" type="text" className="form-control" placeholder="Search" onChange={this._handle_search}   onKeyUp={this._handle_search}/>
	</div>

    }
    /**
     * Renders the add object button. Checks to see if permission is given by has_add_permission
     * @private 
     * @return An add button component
     */

    _render_add_button()
    {

	if(this.has_add_permission())
	{
		return <button className={"ra-add-button"} onClick={this._object_link_clicked(null)} > Add {_.startCase(this.name)}</button>
	}
    }
    /**
     * Renders the table in the display page. This calls _get_table_header and _get_table_body
     * @private 
     * @return An a table displaying the state queryset set objects
     */

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
    /**
     * An event listener that listens to actions selected.
     * 
     *@param {string} action -  the action selected
     */


    action_selected(action)
    {

	return (event)=>{

	    this.actions[action](this.state.selected_objects.getItems());
	    this.get_queryset(this.state.page_number,this.list_per_page);
	}
	

    }
    /**
     * An event listener that listens when a page is  selected.
     * 
     *@param {number} page -  the page number selected
     */

    selectPage(page)
    {

	return (event)=>
	{
	
	    this.setState({page_number: page.page},()=>{

		this.setState({queryset: this.get_queryset()})

	    });
	    event.preventDefault();
	}



    }
    /**
     * An event listener that listens when the next page is  selected.
     * 
     */

    nextPage()
    {

	this.setState({page_number: Math.min(this.state.page_number+1,this.state.total)});
	    
	
    }
    /**
     * An event listener that listens when the previous page is  selected.
     * 
     */

    prevPage()
    {

	this.setState({page_number: Math.max(this.state.page_number-1,1)});
	    
	
    }
    /**
     * Renders the pagination UI
     * 
     * @return A component that renders the pagination controls
     */

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

	return <div className="float-right">
	    <span className="summary">{this.list_per_page*(this.state.page_number-1)+1 }-{Math.min(this.list_per_page*(this.state.page_number-1)+this.list_per_page,this.state.total)} of {this.state.total} </span>  

	<nav  aria-label="Page navigation">
	<ul className="pagination">
	<li className="page-item">
	<a href="#" aria-label="Previous" onClick={this.prevPage} className="page-link">
	<span aria-hidden="true">&laquo;</span>
	</a>
	    </li>
	    
	{pages.map((page)=>{
	    return <li className="page-item"><a href="#" className="page-link"  onClick={this.selectPage({page})}>{page}</a></li>
	})
	}
	<li className="page-item">
	<a href="#" onClick={this.nextPage} aria-label="Next" className="page-link">
	<span aria-hidden="true">&raquo;</span>
	</a>
	</li>
	</ul>
	
	</nav>
	</div>
    }
    /**
     * Renders the actions select component
     * 
     * @return A component that renders a select input for all actions in the list display page
     */

    _render_actions()
    {

	    
	return <select className="ra-action-button">
	<option value="" disabled selected>Choose an action</option>
	{ _.keys(this.actions).map((action)=>{
	    return <option value={action} onChange={this.action_selected(action)}>{_.startCase(action)}</option> 

	    })}
	</select>
	
    }
    /**
     * Renders the back button component in the add/change view
     * 
     * @return A component that renders a back button
     */


    _render_back_button()
    {
	
	return <div><button className={"ra-back-button"} onClick={()=>{this.setState({displayType : displayType.list,object: null })}}> Back </button></div>
	

    }
    /**
     * Renders the admin interface component
     * 
     * @return A component that renders the admin interface
     */

    render()
    {


	if(this.state.displayType == displayType.list)
	{

	    return (
		<div className="list">

		{this._render_add_button()}
		{this._render_search_field()}
		{this._render_actions()}
		{this._render_table()}
		{this.state.loading ? this.render_progress() : null} 
		{this._render_pagination()}
		</div>
	    )
	    
	}
	else
	{
	    
	    
	    return (
		
		<div className="change-form">
		{this._render_back_button()}
		{this.get_form(this.state.object)}
		</div>
	    )
	}

	
    }
    
}




export default Admin;
