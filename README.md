# SISTEMA FULL STACK BASADO EN ARQUITECTURA DE MICROSERVICIOS PARA LA GESTIÓN AUTOMATIZADA Y CENTRALIZADA DE INVENTARIOS EN MYPES
## El presente proyecto tiene como objeto de estudio el desarrollo de un sistema Full Stack orientado a una ERP modular para la administración y automatización de inventarios en MYPES, implementado bajo una arquitectura de microservicios.
## Objetivo general
Desarrollar un sistema Full Stack basado en una arquitectura de microservicios que permita la gestión automatizada de inventarios y el control de vencimientos de productos en MYPES, con el propósito de mejorar la administración de existencias, así como optimizar la toma de decisiones relacionadas al inventario mediante el uso de notificaciones automáticas y el control de acceso basado en roles.
## Objetivos específicos
    •   Desarrollar una arquitectura Full Stack basada en microservicios que permita integrar los procesos de registro, actualización y control de productos, con el propósito de mejorar la administración de existencias dentro del inventario.
    •   Diseñar y desarrollar una interfaz intuitiva que facilite la visualización y la gestión de las existencias que maneja la empresa, con el propósito de optimizar la toma de decisiones relacionadas a la administración del inventario. 
    •   Desarrollar servicios backend desacoplados que permitan automatizar la gestión de los inventarios que maneja la empresa, con el propósito de reducir pérdidas económicas ocasionadas por sobre stock o vencimiento.
    •	Incorporar mecanismos de autenticación y control de acceso basado en roles dentro del sistema, que garanticen la seguridad de la información y una adecuada gestión del inventario. 
    •	Desarrollar un sistema que genere notificaciones visuales en la interfaz alertando sobre productos próximos a vencer o vencidos, con el propósito de optimizar la toma decisiones oportunas relacionadas a la rotación o salida de existencias del inventario.


## Alcance
    •	El sistema tendrá una interfaz web intuitiva para la gestión de productos.
    •	El sistema tendrá servicios backend desacoplados que permitan la gestión y búsqueda de productos.
    •	El sistema integrara un servicio de autenticación y autorización basado en roles mediante tokens JWT. 
    •	El sistema manejara un servicio de notificaciones que permita mediante notificaciones internas de tipo visual detectar productos próximos a vencer o vencidos.
    •	El sistema emitirá notas de venta cuando se realice un retiro de producto de este tipo.
    •	Las pruebas funcionales del sistema se realizarán en un escenario correspondiente a una MYPE de la ciudad de Cochabamba
## Limitaciones
    •	El sistema no manejará la generación de facturas debido a regulaciones nacionales y de configuración.
    •	El sistema no realizara ningún análisis o generara sugerencias en base a los productos registrados, su marca, su precio o su uso dentro de la plataforma, por lo tanto, no incorporara algoritmos de análisis predictivo o inteligencia artificial para el análisis o proyección de la demanda o rotación de productos.
    •	El sistema no generara notificaciones que integren servicios externos de mensajería como ser: correo electrónico, mensajes de texto.
    •	La implementación se realizará en un entorno de prueba controlado, por lo que no se contempla su despliegue en infraestructura de alta disponibilidad o escalabilidad empresarial.
## Stack tecnológico
    •	React JS
    •	Spring Boot
    •	RabbitMQ
    •	PostgreSQL
## Arquitectura
    → Cliente (Frontend (React JS)) 
    → API (Backend (Implementado con microservicios Spring Boot))
    → Base de datos (PostgreSQL)

## Endpoints core
Autenticación y gestión de usuarios
1.	POST api/auth/login
2.	GET api/users/{id}
3.	GET api/users
4.	POST api/users
5.	PUT api/users/{id}
6.	DELETE api/users/{id}
7.	PUT api/users/{id}/change-password
Gestion de productos
1.	GET api/products
2.	GET api/ products /{id}
3.	POST api/ products
4.	PUT api/ products /{id}
5.	DELETE api/ products /{id}
6.	POST api/ products
7.	POST api/movements
Gestion de notificaciones
1.	GET api/notifications
2.	GET api/notifications/unread-count
3.	POST api/notifications/mark-all-read
4.	DELETE api/notifications/{id}
5.	POST api/notifications/generate-notifications
## Cómo ejecutar el proyecto (local)
    Clonar el repositorio 
    git clone https://github.com/jhonaumss/inventory_ms.git
    Ejecucion Backend
    Setear los variables de entorno
    Orden de ejecución de servicios Backend
    •	Ejecutar el servicio config-service
    •	Ejecutar el servicio eureka-service
    •	Ejecutar el servicio auth-service
    •	Ejecutar el servicio inventory-service
    •	Ejecutar el servicio notification-service
    Ejecución Frontend
    Dirigirse a la carpeta “frontend” del proyecto
    Abrir la consola en esta ruta e ingresar los siguientes comandos
    npm install
    npm run dev
## Variables de entorno 
    ${DB_HOST}
    ${DB_PORT}
    ${DB_NAME}
    ${DB_USER}
    ${DB_PASSWORD}
    ${JWT_SECRET}
    ${JWT_EXPIRATION} 
    ${PORT}
