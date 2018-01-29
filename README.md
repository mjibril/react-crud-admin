# react-crud-admin

**react-crud-admin** is inspired by the Django Admin Interface. In the spirit of Django admin it opts for component customization by inheritance. The create-read-update-delete pattern is something that is encountered in a lot of apps. By creating a single component that lists entries and allows adding/changing it becomes possible to implement a DRY approach.

Since React is primarily a UI library and there are a litany of  backends, **react-crud-admin** does not implement any backend specific features but allows the developer to provide custom implementations.

# Getting Started

## Installation

Install the library,

    npm install react-crud-admin

## Example

If you are starting a react project you can use **create-react-app** to speed up bootstrapping,

    npm install create-react-app
    npx create-react-app example
    cd example

then within the `example` directory,

    npm install react-crud-admin


Create a new file `example.js` in the `\src` folder, in that file add the following lines

```javascript
    import Admin from "react-crud-admin";


    export default class Example extends Admin
    {
	constructor()
    	{
		super()
		this.name='Contact'; // name of the objects 
		this.name_plural='Contacts'; // name of the objects in plural
		this.list_display_links=['name']; // which property of the object is clickable
	}
     }
    get_list_display()
    {
    	// a list of properties of the object to displayed on the list display page
	return ['name','number','address.street']
    }

    get_queryset()
    {
    	// the actual array containing objects to be displayed
	return [
	    {id: 1, name: 'Joe Next', number: '08939303003',address:{ street: "Hallmark Street"}},
            {id: 2,name: 'Isa Yoll', number: '0908839202',address:{ street: "Barbican Street"}}
	]
	    
    }

    }  
     
```

then in `index.js` do

```javascript

import React from 'react';
import ReactDOM from 'react-dom';


import Example from './example.js';




ReactDOM.render(<Example/>
    ,  document.querySelector("#app"))

```