
# Class: ECSYThreeWorld

## Hierarchy

* World

  ↳ **ECSYThreeWorld**

## Index

### Constructors

* [constructor](ecsythreeworld.md#constructor)

### Properties

* [enabled](ecsythreeworld.md#enabled)

### Methods

* [createEntity](ecsythreeworld.md#createentity)
* [execute](ecsythreeworld.md#execute)
* [getSystem](ecsythreeworld.md#getsystem)
* [getSystems](ecsythreeworld.md#getsystems)
* [play](ecsythreeworld.md#play)
* [registerComponent](ecsythreeworld.md#registercomponent)
* [registerSystem](ecsythreeworld.md#registersystem)
* [stop](ecsythreeworld.md#stop)
* [unregisterSystem](ecsythreeworld.md#unregistersystem)

## Constructors

###  constructor

\+ **new ECSYThreeWorld**(`options?`: WorldOptions): *[ECSYThreeWorld](ecsythreeworld.md)*

*Inherited from [ECSYThreeWorld](ecsythreeworld.md).[constructor](ecsythreeworld.md#constructor)*

Create a new World.

**Parameters:**

Name | Type |
------ | ------ |
`options?` | WorldOptions |

**Returns:** *[ECSYThreeWorld](ecsythreeworld.md)*

## Properties

###  enabled

• **enabled**: *boolean*

*Inherited from [ECSYThreeWorld](ecsythreeworld.md).[enabled](ecsythreeworld.md#enabled)*

Whether the world tick should execute.

## Methods

###  createEntity

▸ **createEntity**(`name?`: string): *[ECSYThreeEntity](ecsythreeentity.md)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`name?` | string |

**Returns:** *[ECSYThreeEntity](ecsythreeentity.md)*

___

###  execute

▸ **execute**(`delta?`: number, `time?`: number): *void*

*Inherited from [ECSYThreeWorld](ecsythreeworld.md).[execute](ecsythreeworld.md#execute)*

Update the systems per frame.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`delta?` | number | Delta time since the last call |
`time?` | number | Elapsed time  |

**Returns:** *void*

___

###  getSystem

▸ **getSystem**‹**S**›(`System`: SystemConstructor‹S›): *S*

*Overrides void*

**Type parameters:**

▪ **S**: *System*

**Parameters:**

Name | Type |
------ | ------ |
`System` | SystemConstructor‹S› |

**Returns:** *S*

___

###  getSystems

▸ **getSystems**(): *Array‹[ECSYThreeSystem](ecsythreesystem.md)›*

*Overrides void*

**Returns:** *Array‹[ECSYThreeSystem](ecsythreesystem.md)›*

___

###  play

▸ **play**(): *void*

*Inherited from [ECSYThreeWorld](ecsythreeworld.md).[play](ecsythreeworld.md#play)*

Resume execution of this world.

**Returns:** *void*

___

###  registerComponent

▸ **registerComponent**‹**C**›(`Component`: ComponentConstructor‹C›, `objectPool?`: ObjectPool‹C› | false): *this*

*Inherited from [ECSYThreeWorld](ecsythreeworld.md).[registerComponent](ecsythreeworld.md#registercomponent)*

Register a component.

**Type parameters:**

▪ **C**: *Component‹any›*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`Component` | ComponentConstructor‹C› | Type of component to register  |
`objectPool?` | ObjectPool‹C› &#124; false | - |

**Returns:** *this*

___

###  registerSystem

▸ **registerSystem**(`System`: SystemConstructor‹any›, `attributes?`: object): *this*

*Inherited from [ECSYThreeWorld](ecsythreeworld.md).[registerSystem](ecsythreeworld.md#registersystem)*

Register a system.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`System` | SystemConstructor‹any› | Type of system to register  |
`attributes?` | object | - |

**Returns:** *this*

___

###  stop

▸ **stop**(): *void*

*Inherited from [ECSYThreeWorld](ecsythreeworld.md).[stop](ecsythreeworld.md#stop)*

Stop execution of this world.

**Returns:** *void*

___

###  unregisterSystem

▸ **unregisterSystem**(`System`: SystemConstructor‹any›): *this*

*Inherited from [ECSYThreeWorld](ecsythreeworld.md).[unregisterSystem](ecsythreeworld.md#unregistersystem)*

Unregister a system.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`System` | SystemConstructor‹any› | Type of system to unregister  |

**Returns:** *this*
