
# Class: ECSYThreeEntity

## Hierarchy

* Entity

  ↳ **ECSYThreeEntity**

## Index

### Properties

* [alive](ecsythreeentity.md#alive)
* [id](ecsythreeentity.md#id)

### Methods

* [addComponent](ecsythreeentity.md#addcomponent)
* [addObject3DComponent](ecsythreeentity.md#addobject3dcomponent)
* [clone](ecsythreeentity.md#clone)
* [copy](ecsythreeentity.md#copy)
* [getComponent](ecsythreeentity.md#getcomponent)
* [getComponentTypes](ecsythreeentity.md#getcomponenttypes)
* [getComponents](ecsythreeentity.md#getcomponents)
* [getComponentsToRemove](ecsythreeentity.md#getcomponentstoremove)
* [getMutableComponent](ecsythreeentity.md#getmutablecomponent)
* [getObject3D](ecsythreeentity.md#getobject3d)
* [getRemovedComponent](ecsythreeentity.md#getremovedcomponent)
* [hasAllComponents](ecsythreeentity.md#hasallcomponents)
* [hasAnyComponents](ecsythreeentity.md#hasanycomponents)
* [hasComponent](ecsythreeentity.md#hascomponent)
* [hasRemovedComponent](ecsythreeentity.md#hasremovedcomponent)
* [remove](ecsythreeentity.md#remove)
* [removeAllComponents](ecsythreeentity.md#removeallcomponents)
* [removeComponent](ecsythreeentity.md#removecomponent)
* [removeObject3DComponent](ecsythreeentity.md#removeobject3dcomponent)
* [reset](ecsythreeentity.md#reset)

## Properties

###  alive

• **alive**: *boolean*

*Inherited from void*

Whether or not the entity is alive or removed.

___

###  id

• **id**: *number*

*Inherited from void*

A unique ID for this entity.

## Methods

###  addComponent

▸ **addComponent**<**P**, **C**>(`Component`: ComponentConstructor‹P, C›, `values?`: P): *this*

*Inherited from void*

Add a component to the entity.

**Type parameters:**

▪ **P**

▪ **C**: *Component‹P›*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`Component` | ComponentConstructor‹P, C› | Type of component to add to this entity |
`values?` | P | Optional values to replace the default attributes on the component  |

**Returns:** *this*

___

###  addObject3DComponent

▸ **addObject3DComponent**(`obj`: Object3D, `parentEntity`: Entity): *this*

**Parameters:**

Name | Type |
------ | ------ |
`obj` | Object3D |
`parentEntity` | Entity |

**Returns:** *this*

___

###  clone

▸ **clone**(): *this*

*Inherited from void*

**Returns:** *this*

___

###  copy

▸ **copy**(`source`: this): *this*

*Inherited from void*

**Parameters:**

Name | Type |
------ | ------ |
`source` | this |

**Returns:** *this*

___

###  getComponent

▸ **getComponent**<**P**, **C**>(`Component`: ComponentConstructor‹P, C›, `includeRemoved?`: boolean): *C*

*Inherited from void*

Get an immutable reference to a component on this entity.

**Type parameters:**

▪ **P**

▪ **C**: *Component‹P›*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`Component` | ComponentConstructor‹P, C› | Type of component to get |
`includeRemoved?` | boolean | Whether a component that is staled to be removed should be also considered  |

**Returns:** *C*

___

###  getComponentTypes

▸ **getComponentTypes**(): *Array‹Component‹any››*

*Inherited from void*

Get a list of component types that have been added to this entity.

**Returns:** *Array‹Component‹any››*

___

###  getComponents

▸ **getComponents**(): *object*

*Inherited from void*

Get an object containing all the components on this entity, where the object keys are the component types.

**Returns:** *object*

* \[ **componentName**: *string*\]: Component‹any›

___

###  getComponentsToRemove

▸ **getComponentsToRemove**(): *object*

*Inherited from void*

Get an object containing all the components that are slated to be removed from this entity, where the object keys are the component types.

**Returns:** *object*

* \[ **componentName**: *string*\]: Component‹any›

___

###  getMutableComponent

▸ **getMutableComponent**<**P**, **C**>(`Component`: ComponentConstructor‹P, C›): *C*

*Inherited from void*

Get a mutable reference to a component on this entity.

**Type parameters:**

▪ **P**

▪ **C**: *Component‹P›*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`Component` | ComponentConstructor‹P, C› | Type of component to get  |

**Returns:** *C*

___

###  getObject3D

▸ **getObject3D**<**T**>(): *T & [ECSYThreeObject3D](../interfaces/ecsythreeobject3d.md)*

**Type parameters:**

▪ **T**: *Object3D*

**Returns:** *T & [ECSYThreeObject3D](../interfaces/ecsythreeobject3d.md)*

___

###  getRemovedComponent

▸ **getRemovedComponent**<**P**, **C**>(`Component`: ComponentConstructor‹P, C›): *C*

*Inherited from void*

Get a component that is slated to be removed from this entity.

**Type parameters:**

▪ **P**

▪ **C**: *Component‹P›*

**Parameters:**

Name | Type |
------ | ------ |
`Component` | ComponentConstructor‹P, C› |

**Returns:** *C*

___

###  hasAllComponents

▸ **hasAllComponents**(`Components`: Array‹ComponentConstructor‹any, any››): *boolean*

*Inherited from void*

Check if the entity has all components in a list.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`Components` | Array‹ComponentConstructor‹any, any›› | Component types to check  |

**Returns:** *boolean*

___

###  hasAnyComponents

▸ **hasAnyComponents**(`Components`: Array‹ComponentConstructor‹any, any››): *boolean*

*Inherited from void*

Check if the entity has any of the components in a list.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`Components` | Array‹ComponentConstructor‹any, any›› | Component types to check  |

**Returns:** *boolean*

___

###  hasComponent

▸ **hasComponent**<**P**, **C**>(`Component`: ComponentConstructor‹P, C›, `includeRemoved?`: boolean): *boolean*

*Inherited from void*

Check if the entity has a component.

**Type parameters:**

▪ **P**

▪ **C**: *Component‹P›*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`Component` | ComponentConstructor‹P, C› | Type of component |
`includeRemoved?` | boolean | Whether a component that is staled to be removed should be also considered  |

**Returns:** *boolean*

___

###  hasRemovedComponent

▸ **hasRemovedComponent**<**P**, **C**>(`Component`: ComponentConstructor‹P, C›): *boolean*

*Inherited from void*

Check if the entity has a component that is slated to be removed.

**Type parameters:**

▪ **P**

▪ **C**: *Component‹P›*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`Component` | ComponentConstructor‹P, C› | Type of component  |

**Returns:** *boolean*

___

###  remove

▸ **remove**(`forceImmediate`: boolean): *void*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`forceImmediate` | boolean |

**Returns:** *void*

___

###  removeAllComponents

▸ **removeAllComponents**(`forceImmediate?`: boolean): *void*

*Inherited from void*

Remove all components on this entity.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`forceImmediate?` | boolean | Whether all components should be removed immediately  |

**Returns:** *void*

___

###  removeComponent

▸ **removeComponent**<**P**, **C**>(`Component`: ComponentConstructor‹P, C›, `forceImmediate?`: boolean): *this*

*Inherited from void*

Remove a component from the entity.

**Type parameters:**

▪ **P**

▪ **C**: *Component‹P›*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`Component` | ComponentConstructor‹P, C› | Type of component to remove from this entity |
`forceImmediate?` | boolean | Whether a component should be removed immediately  |

**Returns:** *this*

___

###  removeObject3DComponent

▸ **removeObject3DComponent**(`unparent`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`unparent` | boolean |

**Returns:** *void*

___

###  reset

▸ **reset**(): *void*

*Inherited from void*

**Returns:** *void*
