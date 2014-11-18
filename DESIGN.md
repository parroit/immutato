##Primitive types

##Structured types

* Each property value has to be a js primitive or another structured type.




###Internal working

###Property functor

A 'Property functor' is a function that represent a property value V with following characteristics:

* if no arguments are given: return V 
* if one argument V1 is given: return a new Type object that represent the new state of the structured types, containing V1 as value for property. 
V1 is checked to be the same type of V, or an error is thrown.


#### The transaction array

A structured type internally represent it's properties with an array of 
transaction. This array is shared between versions of the same structured type instance. 
The first transaction is inserted in the array by I.create method:

```javascript
var me = I.create({
    name: '',
    surname: ''
});

me->transactions == [{
    name: '',
    surname: ''
}]
```

And therefore, each update to the data structure create a new item in transactions array.

```javascript
me = me.name('Andrea');
me = me.surname('Parodi');

me->transactions == [{
    name: '',
    surname: ''
},{
    name: 'Andrea'
},{
    surname: 'Parodi'
}]
```


A first implementation was using js prototype mechanism to access
property values. Each new version of the structured instance has
previous instance as it's prototype. 

This was easy to implement, but it result to be slow and not flexible.
It was slow because a property that is not changed after N updates has to go through a prototype chain of N to be read.

To mitigate this factor, we shallow copy the entire object after M updates,
guaranting that no proto chain will ever grown over M, but effectively loosing the undo possibility on the (M+1)° version of the instance (because it is a fresh new shallow copy, and so it's previous version is not accessible by proto)

And it was unflexible because undoed version doesn't know which is their
succiding version (we cannot set it because they are effectively immutable)

So now each version keep a table of property indexes. 


####The property indexes table


Each property in this table has an index that keep track of the position 
in transaction array where property value could be read.
The index table has to be shallow copied for each update to the structure.

This is very inefficient for structure with many properties, such as array,
and it is near equivalent to copy all property values from the current copy to the new one. 

However, we can implement a mitigating approach, that is to use the prototypal feature described before to copy only one index (that of the changing property). We can shallow copy the table once every L updates, where
L is the number of property in the object. This way, we do 2 table property copy for every update to the structure. One property is copied during update,
another one when the threshold is reached.


So, the internal representation of a structured type at version --N, actually is:

      
    -- transactionArray (shared between version1,version2, ... versionN)
    -- propertyIndexes (-> __proto__ -> propertyIndex N-1 -> __proto__ ->         propertyIndex N-2 ... -> __proto__ -> propertyIndex 1)
    -- propertyFunctors (each closing on a position of the propertyIndexes)
    


####Accessing a property value 

Each property functor of a structured type is a closure on the index 
within the property indexes table that represrnt the property.

For example, with the type: 

```javascript
I.create({
    name: '',
    surname: ''
});
```

the name functor will close on index 0, and the surname functor will close 
on index 1.

To actually read a value, a property functor has to:

- read it's property index from the property indexes table
- read the transaction at index from the transaction array 
- pick from it the value of needed property
- return it.


####Update a property value 

To update a value, a property functor has to build a new instance
of the structured type containing the new value. This could be accomplished 
by the following steps:

* Insert a new transaction with property values in transactionTable
* Build a new instance of propertyIndexes containing new indexes for updated properties
  - This is done by create a new propertyIndexes that has current one as prototype, or by shallow copying the current propertyIndexes on a given threeshold.
  
* Build a new instance using the function prototype defined by 'create' method.
  - Each functor is already a property of this prototype. 
  - The new instance already close around the transaction table, which is defined by 'create' method
  - The new propertyIndexes is setted as a property of the new instance

* new instance is frozen
* new instance is returned to caller





###Examples

```javascript

//
//  object creation
//
var me = I.create({
    name: '',
    surname: ''
});
me.name().should.be.equal('')
me.surname().should.be.equal('')

// 
// update a property
//
var meV2 = guy.name('Andrea');
meV2.name().should.be.equal('Andrea')
meV2.surname().should.be.equal('')

//
// retain previous version
//
var meV1 = meV2.undo();
meV1.should.be.equal(me);


//
// if there is no previous version, return null
//
var before = me.undo();
expect(before).to.be.equal(null); 

//
// retain subsequent versions
//
var after = me.redo();
after.should.be.equal(meV2);

```