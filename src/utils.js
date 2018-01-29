

export function toTitleCase(word)
{

    let t=word.toLowerCase();
    t[0]=t[0].toUpperCase();
    return t;

}


/*
export function add(items,newItem,isEqual)
{
    result=[];
    
    let flag=true;
    for(let item of items)
    {
	result.push(item);
	
	if(isEqual(item,newItem))
	{
	    flag=false;
	}
	    

    }
    if(flag)
    {
	    result.push(newItem);
    }
    return result
}

export  function union(array1,array2,isEqual)
{
    
    let result=[];
    if(array1.length==0)
    {
	return array2;
	    
    }
    if(array2.length==0)
    {
	return array1;
	
    }

    for(let item of  array1)
    {
	result=add(array2,newItem,isEqual);
    }
    return result;
}

export  function intersection(array1,array2,isEqual)
    {
	let result=[];


	for(let item1 of array1)
	{
	    for(let item2 of array2)
	    {

		if(isEqual(item1,item2))
		{
		    result.push(item1);
		}
		    
	    }
	}
	return result;

    }
    

export function elementIn(array,item,isEqual)
{

    for(let item2 of array)
    {
	if(isEqual(item,item2))
	{
	    return true;
	}
    }
    return false;
}
export function  difference(array1,array2,isEqual)
{
    let result=[];


    for(let item1 of array1)
    {
	if(!elementIn(array2,item1,isEqual))
	{
	    result.push(item1);

	}


    }
    
    return result;
}
*/
