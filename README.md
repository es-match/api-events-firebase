# api-events-firebase

API Criada para uso dentro do aplicativo Easy Sport Match, desenvolvido durante especializaçao em Engenharia de Software EES UFSCAR


Requests disponíveis



# GET /events/byGroup/:groupID

## Request
| Parâmetros    | Tipo          | Obrigatório  |
| ------------- |---------------| -------------|
| groupid            | string        | sim          |


## Response
| Parâmetros    | Tipo          |
| ------------- |---------------|
| listEvents     | List<Map<string,string>>        |

---

# GET /events/byUserFollow/:userID

## Request
| Parâmetros    | Tipo          | Obrigatório  |
| ------------- |---------------| -------------|
| userid      | string              | sim        |


## Response
| Parâmetros    | Tipo          |
| ------------- |---------------|
| listEvents     | List<Map<string,string>>        |

---


# GET /events/byLocation/:locationID

## Request
| Parâmetros    | Tipo          | Obrigatório  |
| ------------- |---------------| -------------|
| locationID      | string              | sim        |


## Response
| Parâmetros    | Tipo          |
| ------------- |---------------|
| listEvents     | List<Map<string,string>>        |

---

# GET /events/:id

## Request
| Parâmetros    | Tipo          | Obrigatório  |
| ------------- |---------------| -------------|
|  id     |               |         |


## Response
| Parâmetros    | Tipo          |
| ------------- |---------------|
| listEvents     | List<Map<string,string>>        |

---

# GET /events/

## Request
| Parâmetros    | Tipo          | Obrigatório  |
| ------------- |---------------| -------------|
|       |               |         |


## Response
| Parâmetros    | Tipo          |
| ------------- |---------------|
| listEvents     | List<Map<string,string>>        |

---


# POST /events

## Request
| Parâmetros    | Tipo          | Obrigatório  |
| ------------- |---------------| -------------|
| startDate      | string              | sim   |
| endDate      | string              | sim   |
| userID      | string              | sim   |
| eventName      | string              | sim   |
| locationID      | string              | sim   |
| groupID      | string              | sim   |


## Response
| Parâmetros    | Tipo          |
| ------------- |---------------|
|  newEvent     | List<Map<string,string>>|

---

# DELETE /events/:id

## Request
| Parâmetros    | Tipo          | Obrigatório  |
| ------------- |---------------| -------------|
| id      | string              | sim   |


## Response
| Parâmetros    | Tipo          |
| ------------- |---------------|
|  response     | string |

---

# PATCH /events/:id

| Parâmetros    | Tipo          | Obrigatório  |
| ------------- |---------------| -------------|
| id      | string              | sim   |
| startDate      | string              | sim   |
| endDate      | string              | sim   |
| userID      | string              | sim   |
| eventName      | string              | sim   |
| locationID      | string              | sim   |
| groupID      | string              | sim   |

## Response
| Parâmetros    | Tipo          |
| ------------- |---------------|
|  response     | string               |        

