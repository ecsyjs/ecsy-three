
# Class: WebGLRendererComponent

## Hierarchy

* Component‹[WebGLRendererComponent](webglrenderercomponent.md)›

  ↳ **WebGLRendererComponent**

## Index

### Constructors

* [constructor](webglrenderercomponent.md#constructor)

### Properties

* [camera](webglrenderercomponent.md#camera)
* [renderer](webglrenderercomponent.md#renderer)
* [scene](webglrenderercomponent.md#scene)
* [isComponent](webglrenderercomponent.md#static-iscomponent)
* [schema](webglrenderercomponent.md#static-schema)

### Methods

* [clone](webglrenderercomponent.md#clone)
* [copy](webglrenderercomponent.md#copy)
* [dispose](webglrenderercomponent.md#dispose)
* [reset](webglrenderercomponent.md#reset)

## Constructors

###  constructor

\+ **new WebGLRendererComponent**(`props?`: Partial‹Omit‹[WebGLRendererComponent](webglrenderercomponent.md), keyof Component<any>›› | false): *[WebGLRendererComponent](webglrenderercomponent.md)*

*Inherited from [Object3DComponent](object3dcomponent.md).[constructor](object3dcomponent.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`props?` | Partial‹Omit‹[WebGLRendererComponent](webglrenderercomponent.md), keyof Component<any>›› &#124; false |

**Returns:** *[WebGLRendererComponent](webglrenderercomponent.md)*

## Properties

###  camera

• **camera**: *[ECSYThreeEntity](ecsythreeentity.md)*

___

###  renderer

• **renderer**: *WebGLRenderer*

___

###  scene

• **scene**: *[ECSYThreeEntity](ecsythreeentity.md)*

___

### `Static` isComponent

▪ **isComponent**: *true*

*Inherited from [Object3DComponent](object3dcomponent.md).[isComponent](object3dcomponent.md#static-iscomponent)*

___

### `Static` schema

▪ **schema**: *object*

*Overrides [AudioTagComponent](audiotagcomponent.md).[schema](audiotagcomponent.md#static-schema)*

#### Type declaration:

* **camera**(): *object*

  * **type**: *RefPropType‹Camera›*

* **renderer**(): *object*

  * **type**: *RefPropType‹WebGLRenderer›*

* **scene**(): *object*

  * **type**: *RefPropType‹Object3D›*

## Methods

###  clone

▸ **clone**(): *this*

*Inherited from [Object3DComponent](object3dcomponent.md).[clone](object3dcomponent.md#clone)*

**Returns:** *this*

___

###  copy

▸ **copy**(`source`: this): *this*

*Inherited from [Object3DComponent](object3dcomponent.md).[copy](object3dcomponent.md#copy)*

**Parameters:**

Name | Type |
------ | ------ |
`source` | this |

**Returns:** *this*

___

###  dispose

▸ **dispose**(): *void*

*Inherited from [Object3DComponent](object3dcomponent.md).[dispose](object3dcomponent.md#dispose)*

**Returns:** *void*

___

###  reset

▸ **reset**(): *void*

*Inherited from [Object3DComponent](object3dcomponent.md).[reset](object3dcomponent.md#reset)*

**Returns:** *void*
