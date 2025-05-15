************************************************************************************************
WILLIAM RODRIGUEZ - ENTREGA 03(FINAL) - API MANEJADOR DE PRODRUCTOS Y CARRITOS USANDO HANDLEBARS + WEBSOKET + MONGOOSE + POPULATE + PAGINATION
************************************************************************************************

-->>> El server dispone de las rutas: 

-DESDE EL NAVEGADOR: (HANDLEBARS + WEBSOKET + MONGOOSE + POPULATE + PAGINATION)
http://localhost:8080/home (Con paginacion)
http://localhost:8080/realtimeproducts (Visualiza todos los productos agregados, agrega nuevo producto y Elimina )

-DESDE POSTMAN:
http://localhost:8080/api/products/
http://localhost:8080/api/carts/ 

-->>> Desde postman ejecute un metodo GET para http://localhost:8080/api/

-->>> Metodos HTTP implementados

//************************************************ PRODUCTS
//-->GET    /api/products/
Obtiene todos los productos, incluye nueva respuesta de paginacion.

Ajustando la url se puede filtrar por Categorias siendo Computacion, Oficina o Servicio. Tambien puede ordenar por precio en forma Asc y Desc.
Ejemplo:
	//--Ejemplo 1> Mostrar todos los productos 
		http://localhost:8080/api/products

	//--Ejemplo 2> Mostrar todos los productos Ordenados por precio en orden descendente y categoria "oficina", 
	agregar en la url los parametro sort=-price y query={"category":"oficina"}
		http://localhost:8080/api/products/?limit=10&sort=-price&query={"category":"oficina"}
		
	//--Ejemplo 3> Mostrar todos los productos Ordenados por precio en orden ascendente y categoria "computacion", 
	agregar en la url los parametro sort=price y query={"category":"computacion"}
		http://localhost:8080/api/products/?limit=10&sort=price&query={"category":"computacion"}

Ejemplo de la nueva respuesta:
	{
	"payload": [],
	"totalDocs": 17,
	"limit": 10,
	"totalPages": 2,
	"currentPage": 1,
	"pagingCounter": 1,
	"hasPrevPage": false,
	"hasNextPage": true,
	"prevPage": null,
	"nextPage": 2,
	"status": "success",
	"prevLink": null,
	"nextLink": "http://localhost:8080/api/products?&page=2"
	}
	
//-->GET    /api/products/:pid
Obtiene el producto indicado en el parametro

//-->POST   /api/products/
Agrega un producto

//-->PUT    /api/products/:pid
Actualiza un producto

//-->DELETE /api/products/:pid
Elimina un producto indicado en el parametro

//-->PUT /api/ProductsSeedToBD
Carga productos desde un archivo semilla (products.seed.json) a la BD

//************************************************ CARTS
//-->GET    /api/carts/
Obtiene todos los carritos

//-->GET    /api/carts/:cid
Obtiene el carrito indicado en el parametro, incluye referencia entre Carts y Products aplicando populate.

//-->POST   /api/carts/
Genera un carrito

//-->POST   /api/carts/:cid
Reemplaza la lista actual de productos, por una nueva lista enviada desde Body

//-->PUT   	/api/carts/:cid/product/:pid
Actualiza un carrito agregando un product

//-->DELETE /api/carts/:cid
Elimina todos los productos del carrito especificado

//************************************************ EJEMPLO MODELO JSON DE PRODUCTS
[
  {
    "_id": "68157c3341572e8fb924ef17",
    "title": "Notebook Lenovo 01",
    "description": "Notebook Lenovo 01",
    "code": "100",
    "price": 10,
    "status": 1,
    "category": "computacion",
    "stock": 20,
    "thumbnails": [
      "https://http2.mlstatic.com/D_NQ_NP_2X_620219-MLA54973743242_042023-F.webpg"
    ]
  },
  {
    "_id": "6817f05b32e2815ba5ee452a",
    "title": "Notebook Lenovo 02",
    "description": "Notebook Lenovo 02",
    "code": "02",
    "price": 200,
    "status": 1,
    "category": "computacion",
    "stock": 99,
    "thumbnails": [
      "https://http2.mlstatic.com/D_NQ_NP_2X_644888-MLA82451690623_022025-F.webp"
    ]    
  }
]

//************************************************ EJEMPLO MODELO JSON DE CARTS

[
  {
    "_id": "68216b15828a8b7bd2b9adea",
    "products": [
      {
        "product": "68157b616252e933d195bd2b",
        "quantity": 2,
        "_id": "68216b59f1db314dffad51bc"
      }
    ]
  }
]