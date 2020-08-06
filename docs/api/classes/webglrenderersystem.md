
# Class: WebGLRendererSystem

## Hierarchy

* System

  ↳ **WebGLRendererSystem**

## Index

### Constructors

* [constructor](webglrenderersystem.md#constructor)

### Properties

* [enabled](webglrenderersystem.md#enabled)
* [needsResize](webglrenderersystem.md#needsresize)
* [queries](webglrenderersystem.md#queries)
* [world](webglrenderersystem.md#world)
* [isSystem](webglrenderersystem.md#static-issystem)
* [queries](webglrenderersystem.md#static-queries)

### Methods

* [dispose](webglrenderersystem.md#dispose)
* [execute](webglrenderersystem.md#execute)
* [onResize](webglrenderersystem.md#onresize)
* [play](webglrenderersystem.md#play)
* [stop](webglrenderersystem.md#stop)

## Constructors

###  constructor

\+ **new WebGLRendererSystem**(`world`: World, `attributes?`: Attributes): *[WebGLRendererSystem](webglrenderersystem.md)*

*Inherited from [WebGLRendererSystem](webglrenderersystem.md).[constructor](webglrenderersystem.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`world` | World |
`attributes?` | Attributes |

**Returns:** *[WebGLRendererSystem](webglrenderersystem.md)*

## Properties

###  enabled

• **enabled**: *boolean*

*Inherited from [ECSYThreeSystem](ecsythreesystem.md).[enabled](ecsythreesystem.md#enabled)*

Whether the system will execute during the world tick.

___

###  needsResize

• **needsResize**: *boolean*

___

###  queries

• **queries**: *object*

*Inherited from [ECSYThreeSystem](ecsythreesystem.md).[queries](ecsythreesystem.md#static-queries)*

The results of the queries.
Should be used inside of execute.

#### Type declaration:

* \[ **queryName**: *string*\]: object

* **added**? : *Entity[]*

* **changed**? : *Entity[]*

* **removed**? : *Entity[]*

* **results**: *Entity[]*

___

###  world

• **world**: *World*

*Inherited from [WebGLRendererSystem](webglrenderersystem.md).[world](webglrenderersystem.md#world)*

___

### `Static` isSystem

▪ **isSystem**: *true*

*Inherited from [ECSYThreeSystem](ecsythreesystem.md).[isSystem](ecsythreesystem.md#static-issystem)*

___

### `Static` queries

▪ **queries**: *object*

*Overrides [ECSYThreeSystem](ecsythreesystem.md).[queries](ecsythreesystem.md#static-queries)*

#### Type declaration:

* **renderers**(): *object*

  * **components**: *[typeof WebGLRendererComponent]*

## Methods

###  dispose

▸ **dispose**(): *void*

**Returns:** *void*

___

###  execute

▸ **execute**(): *void*

*Overrides [ECSYThreeSystem](ecsythreesystem.md).[execute](ecsythreesystem.md#abstract-execute)*

**Returns:** *void*

___

###  onResize

▸ **onResize**(): *void*

**Returns:** *void*

___

###  play

▸ **play**(): *void*

*Inherited from [ECSYThreeSystem](ecsythreesystem.md).[play](ecsythreesystem.md#play)*

Resume execution of this system.

**Returns:** *void*

___

###  stop

▸ **stop**(): *void*

*Inherited from [ECSYThreeSystem](ecsythreesystem.md).[stop](ecsythreesystem.md#stop)*

Stop execution of this system.

**Returns:** *void*
