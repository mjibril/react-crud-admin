import Admin from "./admin.js";


class Example extends Admin
{
    constructor()
    {
	super()
	this.name='Contact';
	this.name_plural='Contacts';
	this.list_display_links=['name'];

    }

    get_list_display()
    {

	return ['name','number','address.street']
    }

    get_queryset()
    {
	return [
	    {id: 1, name: 'Ken Next', number: '08939303003',address:{ street: "Hallmark Street"}},
            {id: 2,name: 'Isa Yoll', number: '0908839202',address:{ street: "Barbican Street"}}
	]
	    
    }
}
export default Example;
