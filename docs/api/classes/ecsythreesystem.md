
# Class: ECSYThreeSystem

## Hierarchy

* System

  ↳ **ECSYThreeSystem**

## Index

### Constructors

* [constructor](ecsythreesystem.md#constructor)

### Properties

* [enabled](ecsythreesystem.md#enabled)
* [queries](ecsythreesystem.md#queries)
* [world](ecsythreesystem.md#world)
* [isSystem](ecsythreesystem.md#static-issystem)
* [queries](ecsythreesystem.md#static-queries)

### Methods

* [execute](ecsythreesystem.md#abstract-execute)
* [play](ecsythreesystem.md#play)
* [stop](ecsythreesystem.md#stop)

## Constructors

###  constructor

\+ **new ECSYThreeSystem**(`world`: [ECSYThreeWorld](ecsythreeworld.md), `attributes?`: Attributes): *[ECSYThreeSystem](ecsythreesystem.md)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`world` | [ECSYThreeWorld](ecsythreeworld.md) |
`attributes?` | Attributes |

**Returns:** *[ECSYThreeSystem](ecsythreesystem.md)*

## Properties

###  enabled

• **enabled**: *boolean*

*Inherited from void*

Whether the system will execute during the world tick.

___

###  queries

• **queries**: *object*

*Overrides void*

#### Type declaration:

* \[ **queryName**: *string*\]: object

* **added**? : *[ECSYThreeEntity](ecsythreeentity.md)[]*

* **changed**? : *[ECSYThreeEntity](ecsythreeentity.md)[]*

* **removed**? : *[ECSYThreeEntity](ecsythreeentity.md)[]*

* **results**: *[ECSYThreeEntity](ecsythreeentity.md)[]*

___

###  world

• **world**: *[ECSYThreeWorld](ecsythreeworld.md)*

*Overrides void*

___

### `Static` isSystem

▪ **isSystem**: *true*

*Inherited from void*

___

### `Static` queries

▪ **queries**: *object*

*Inherited from void*

Defines what Components the System will query for.
This needs to be user defined.

#### Type declaration:

* \[ **queryName**: *string*\]: object

* **components**: *ComponentConstructor‹any, any› | NotComponent‹any, any›[]*

* **listen**(): *object*

  * **added**? : *boolean*

  * **changed**? : *boolean | Component‹any›[]*

  * **removed**? : *boolean*

## Methods

### `Abstract` execute

▸ **execute**(`delta`: number, `time`: number): *void*

*Inherited from void*

This function is called for each run of world.
All of the `queries` defined on the class are available here.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`delta` | number | - |
`time` | number |   |

**Returns:** *void*

___

###  play

▸ **play**(): *void*

*Inherited from void*

Resume execution of this system.

**Returns:** *void*

___

###  stop

▸ **stop**(): *void*

*Inherited from void*

Stop execution of this system.

**Returns:** *void*
