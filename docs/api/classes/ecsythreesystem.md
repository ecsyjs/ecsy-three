
# Class: ECSYThreeSystem ‹**EntityType, EntityType**›

## Type parameters

▪ **EntityType**: *Entity*

▪ **EntityType**: *Entity*

## Hierarchy

* System

* System

  ↳ **ECSYThreeSystem**

## Index

### Constructors

* [constructor](ecsythreesystem.md#constructor)

### Properties

* [enabled](ecsythreesystem.md#enabled)
* [priority](ecsythreesystem.md#readonly-priority)
* [queries](ecsythreesystem.md#queries)
* [world](ecsythreesystem.md#world)
* [isSystem](ecsythreesystem.md#static-issystem)
* [queries](ecsythreesystem.md#static-queries)

### Methods

* [execute](ecsythreesystem.md#abstract-execute)
* [init](ecsythreesystem.md#init)
* [play](ecsythreesystem.md#play)
* [stop](ecsythreesystem.md#stop)

## Constructors

###  constructor

\+ **new ECSYThreeSystem**(`world`: [ECSYThreeWorld](ecsythreeworld.md), `attributes?`: Attributes): *[ECSYThreeSystem](ecsythreesystem.md)*

*Overrides [WebGLRendererSystem](webglrenderersystem.md).[constructor](webglrenderersystem.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`world` | [ECSYThreeWorld](ecsythreeworld.md) |
`attributes?` | Attributes |

**Returns:** *[ECSYThreeSystem](ecsythreesystem.md)*

\+ **new ECSYThreeSystem**(`world`: [ECSYThreeWorld](ecsythreeworld.md), `attributes?`: Attributes): *[ECSYThreeSystem](ecsythreesystem.md)*

**Parameters:**

Name | Type |
------ | ------ |
`world` | [ECSYThreeWorld](ecsythreeworld.md) |
`attributes?` | Attributes |

**Returns:** *[ECSYThreeSystem](ecsythreesystem.md)*

## Properties

###  enabled

• **enabled**: *boolean*

*Inherited from [ECSYThreeSystem](ecsythreesystem.md).[enabled](ecsythreesystem.md#enabled)*

*Overrides [ECSYThreeSystem](ecsythreesystem.md).[enabled](ecsythreesystem.md#enabled)*

Whether the system will execute during the world tick.

___

### `Readonly` priority

• **priority**: *number*

*Inherited from [ECSYThreeSystem](ecsythreesystem.md).[priority](ecsythreesystem.md#readonly-priority)*

*Overrides [ECSYThreeSystem](ecsythreesystem.md).[priority](ecsythreesystem.md#readonly-priority)*

Execution priority (i.e: order) of the system.

___

###  queries

• **queries**: *object*

*Overrides [ECSYThreeSystem](ecsythreesystem.md).[queries](ecsythreesystem.md#static-queries)*

#### Type declaration:

* \[ **queryName**: *string*\]: object

* **added**? : *[ECSYThreeEntity](ecsythreeentity.md)[]*

* **changed**? : *[ECSYThreeEntity](ecsythreeentity.md)[]*

* **removed**? : *[ECSYThreeEntity](ecsythreeentity.md)[]*

* **results**: *[ECSYThreeEntity](ecsythreeentity.md)[]*

___

###  world

• **world**: *[ECSYThreeWorld](ecsythreeworld.md)*

*Overrides [WebGLRendererSystem](webglrenderersystem.md).[world](webglrenderersystem.md#world)*

___

### `Static` isSystem

▪ **isSystem**: *true*

*Inherited from [ECSYThreeSystem](ecsythreesystem.md).[isSystem](ecsythreesystem.md#static-issystem)*

*Overrides [ECSYThreeSystem](ecsythreesystem.md).[isSystem](ecsythreesystem.md#static-issystem)*

___

### `Static` queries

▪ **queries**: *SystemQueries*

*Inherited from [ECSYThreeSystem](ecsythreesystem.md).[queries](ecsythreesystem.md#static-queries)*

*Overrides [ECSYThreeSystem](ecsythreesystem.md).[queries](ecsythreesystem.md#static-queries)*

Defines what Components the System will query for.
This needs to be user defined.

## Methods

### `Abstract` execute

▸ **execute**(`delta`: number, `time`: number): *void*

*Inherited from [ECSYThreeSystem](ecsythreesystem.md).[execute](ecsythreesystem.md#abstract-execute)*

*Overrides [ECSYThreeSystem](ecsythreesystem.md).[execute](ecsythreesystem.md#abstract-execute)*

This function is called for each run of world.
All of the `queries` defined on the class are available here.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`delta` | number | - |
`time` | number |   |

**Returns:** *void*

___

###  init

▸ **init**(`attributes?`: Attributes): *void*

*Inherited from [ECSYThreeSystem](ecsythreesystem.md).[init](ecsythreesystem.md#init)*

*Overrides [ECSYThreeSystem](ecsythreesystem.md).[init](ecsythreesystem.md#init)*

Called when the system is added to the world.

**Parameters:**

Name | Type |
------ | ------ |
`attributes?` | Attributes |

**Returns:** *void*

___

###  play

▸ **play**(): *void*

*Inherited from [ECSYThreeSystem](ecsythreesystem.md).[play](ecsythreesystem.md#play)*

*Overrides [ECSYThreeSystem](ecsythreesystem.md).[play](ecsythreesystem.md#play)*

Resume execution of this system.

**Returns:** *void*

___

###  stop

▸ **stop**(): *void*

*Inherited from [ECSYThreeSystem](ecsythreesystem.md).[stop](ecsythreesystem.md#stop)*

*Overrides [ECSYThreeSystem](ecsythreesystem.md).[stop](ecsythreesystem.md#stop)*

Stop execution of this system.

**Returns:** *void*
