
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
* [getObject3D](ecsythreeentity.md#optional-getobject3d)
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

*Inherited from [ECSYThreeEntity](ecsythreeentity.md).[alive](ecsythreeentity.md#alive)*

Whether or not the entity is alive or removed.

___

###  id

• **id**: *number*

*Inherited from [ECSYThreeEntity](ecsythreeentity.md).[id](ecsythreeentity.md#id)*

A unique ID for this entity.

## Methods

###  addComponent

▸ **addComponent**‹**C**›(`Component`: ComponentConstructor‹C›, `values?`: Partial‹Omit‹C, keyof Component<any>››): *this*

*Inherited from [ECSYThreeEntity](ecsythreeentity.md).[addComponent](ecsythreeentity.md#addcomponent)*

Add a component to the entity.

**Type parameters:**

▪ **C**: *Component‹any›*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`Component` | ComponentConstructor‹C› | Type of component to add to this entity |
`values?` | Partial‹Omit‹C, keyof Component<any>›› | Optional values to replace the default attributes on the component  |

**Returns:** *this*

___

###  addObject3DComponent

▸ **addObject3DComponent**(`obj`: Object3D, `parentEntity?`: Entity): *this*

**Parameters:**

Name | Type |
------ | ------ |
`obj` | Object3D |
`parentEntity?` | Entity |

**Returns:** *this*

___

###  clone

▸ **clone**(): *this*

*Inherited from [ECSYThreeEntity](ecsythreeentity.md).[clone](ecsythreeentity.md#clone)*

**Returns:** *this*

___

###  copy

▸ **copy**(`source`: this): *this*

*Inherited from [ECSYThreeEntity](ecsythreeentity.md).[copy](ecsythreeentity.md#copy)*

**Parameters:**

Name | Type |
------ | ------ |
`source` | this |

**Returns:** *this*

___

###  getComponent

▸ **getComponent**‹**C**›(`Component`: ComponentConstructor‹C›, `includeRemoved?`: boolean): *C*

*Inherited from [ECSYThreeEntity](ecsythreeentity.md).[getComponent](ecsythreeentity.md#getcomponent)*

Get an immutable reference to a component on this entity.

**Type parameters:**

▪ **C**: *Component‹any›*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`Component` | ComponentConstructor‹C› | Type of component to get |
`includeRemoved?` | boolean | Whether a component that is staled to be removed should be also considered  |

**Returns:** *C*

___

###  getComponentTypes

▸ **getComponentTypes**(): *Array‹Component‹any››*

*Inherited from [ECSYThreeEntity](ecsythreeentity.md).[getComponentTypes](ecsythreeentity.md#getcomponenttypes)*

Get a list of component types that have been added to this entity.

**Returns:** *Array‹Component‹any››*

___

###  getComponents

▸ **getComponents**(): *object*

*Inherited from [ECSYThreeEntity](ecsythreeentity.md).[getComponents](ecsythreeentity.md#getcomponents)*

Get an object containing all the components on this entity, where the object keys are the component types.

**Returns:** *object*

* \[ **componentName**: *string*\]: Component‹any›

___

###  getComponentsToRemove

▸ **getComponentsToRemove**(): *object*

*Inherited from [ECSYThreeEntity](ecsythreeentity.md).[getComponentsToRemove](ecsythreeentity.md#getcomponentstoremove)*

Get an object containing all the components that are slated to be removed from this entity, where the object keys are the component types.

**Returns:** *object*

* \[ **componentName**: *string*\]: Component‹any›

___

###  getMutableComponent

▸ **getMutableComponent**‹**C**›(`Component`: ComponentConstructor‹C›): *C*

*Inherited from [ECSYThreeEntity](ecsythreeentity.md).[getMutableComponent](ecsythreeentity.md#getmutablecomponent)*

Get a mutable reference to a component on this entity.

**Type parameters:**

▪ **C**: *Component‹any›*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`Component` | ComponentConstructor‹C› | Type of component to get  |

**Returns:** *C*

___

### `Optional` getObject3D

▸ **getObject3D**‹**T**›(): *T & [ECSYThreeObject3D](../interfaces/ecsythreeobject3d.md)*

**Type parameters:**

▪ **T**: *Object3D*

**Returns:** *T & [ECSYThreeObject3D](../interfaces/ecsythreeobject3d.md)*

___

###  getRemovedComponent

▸ **getRemovedComponent**‹**C**›(`Component`: ComponentConstructor‹C›): *C*

*Inherited from [ECSYThreeEntity](ecsythreeentity.md).[getRemovedComponent](ecsythreeentity.md#getremovedcomponent)*

Get a component that is slated to be removed from this entity.

**Type parameters:**

▪ **C**: *Component‹any›*

**Parameters:**

Name | Type |
------ | ------ |
`Component` | ComponentConstructor‹C› |

**Returns:** *C*

___

###  hasAllComponents

▸ **hasAllComponents**(`Components`: Array‹ComponentConstructor‹any››): *boolean*

*Inherited from [ECSYThreeEntity](ecsythreeentity.md).[hasAllComponents](ecsythreeentity.md#hasallcomponents)*

Check if the entity has all components in a list.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`Components` | Array‹ComponentConstructor‹any›› | Component types to check  |

**Returns:** *boolean*

___

###  hasAnyComponents

▸ **hasAnyComponents**(`Components`: Array‹ComponentConstructor‹any››): *boolean*

*Inherited from [ECSYThreeEntity](ecsythreeentity.md).[hasAnyComponents](ecsythreeentity.md#hasanycomponents)*

Check if the entity has any of the components in a list.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`Components` | Array‹ComponentConstructor‹any›› | Component types to check  |

**Returns:** *boolean*

___

###  hasComponent

▸ **hasComponent**‹**C**›(`Component`: ComponentConstructor‹C›, `includeRemoved?`: boolean): *boolean*

*Inherited from [ECSYThreeEntity](ecsythreeentity.md).[hasComponent](ecsythreeentity.md#hascomponent)*

Check if the entity has a component.

**Type parameters:**

▪ **C**: *Component‹any›*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`Component` | ComponentConstructor‹C› | Type of component |
`includeRemoved?` | boolean | Whether a component that is staled to be removed should be also considered  |

**Returns:** *boolean*

___

###  hasRemovedComponent

▸ **hasRemovedComponent**‹**C**›(`Component`: ComponentConstructor‹C›): *boolean*

*Inherited from [ECSYThreeEntity](ecsythreeentity.md).[hasRemovedComponent](ecsythreeentity.md#hasremovedcomponent)*

Check if the entity has a component that is slated to be removed.

**Type parameters:**

▪ **C**: *Component‹any›*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`Component` | ComponentConstructor‹C› | Type of component  |

**Returns:** *boolean*

___

###  remove

▸ **remove**(`forceImmediate?`: boolean): *void*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`forceImmediate?` | boolean |

**Returns:** *void*

___

###  removeAllComponents

▸ **removeAllComponents**(`forceImmediate?`: boolean): *void*

*Inherited from [ECSYThreeEntity](ecsythreeentity.md).[removeAllComponents](ecsythreeentity.md#removeallcomponents)*

Remove all components on this entity.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`forceImmediate?` | boolean | Whether all components should be removed immediately  |

**Returns:** *void*

___

###  removeComponent

▸ **removeComponent**‹**C**›(`Component`: ComponentConstructor‹C›, `forceImmediate?`: boolean): *this*

*Inherited from [ECSYThreeEntity](ecsythreeentity.md).[removeComponent](ecsythreeentity.md#removecomponent)*

Remove a component from the entity.

**Type parameters:**

▪ **C**: *Component‹any›*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`Component` | ComponentConstructor‹C› | Type of component to remove from this entity |
`forceImmediate?` | boolean | Whether a component should be removed immediately  |

**Returns:** *this*

___

###  removeObject3DComponent

▸ **removeObject3DComponent**(`unparent?`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`unparent?` | boolean |

**Returns:** *void*

___

###  reset

▸ **reset**(): *void*

*Inherited from [ECSYThreeEntity](ecsythreeentity.md).[reset](ecsythreeentity.md#reset)*

**Returns:** *void*
