export default class Set {
    constructor(items=[],isEqual=(a,b)=> a==b)
    {
	this.items=items
	this.isEqual=isEqual
    }
    add(item)
    {
	for(let i=0;i<this.items.length;i++)
	{
	    if(this.isEqual(this.items[i],item))
	    {
		return true
	    }
	}
	this.items.push(item);
	return true
    }
    remove(item)
    {
	let index=-1;
	for(let i=0;i<this.items.length;i++)
	{
	    if(this.isEqual(this.items[i],item))
	    {
		index=i;
		break;
	    }
	}
	if(index>=0)
	{
	    if(index>0 && index<this.items.length-1)
	    {
		let array1=this.items.slice(index+1,this.items.length)
		let array2=this.items.slice(0,index)

		for(let i=0;i<array1.length;i++)
		{
		    array2.push(array1[i]);
		}
		this.items=array2;
		return true
	    }

	    if(index==0)
	    {

		this.items=this.items.slice(1,this.items.length)
		return true
	    }
	    if(index==this.items.length-1)
	    {
		this.items=this.items.slice(0,this.items.length-1)
		return true
	    }
	}
	return true
	    
    }
    contains(item)
    {
	for(let i=0;i<this.items.length;i++)
	{
	    if(this.isEqual(this.items[i],item))
	    {
		return true
	    }
	}
	return false;
    }
    getItems()
    {
	return this.items.slice();
    }

}
