import React from 'react'

const DialogoContrato = (params) => {

    return (
        <div id='modalContrato' className="modal fade bd-example-modal-lg" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>Términos y condiciones de uso de servicios GenialApp</h1>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <i className="fa-solid fa-rectangle-xmark fa-xl"></i>
                        </button>
                    </div>
                    <div>
                        <p style={{ textAlign: 'justify', margin: '1em', fontSize: '0.9em' }}>
                            En el presente documento, en adelante el “contrato”, se describen, y posteriormente se aceptan, los términos y condiciones de uso, de una aplicación web, y otra aplicación web como herramienta de gestión de la primera, proporcionadas por GenialApp, o su autor intelectual  Cesar Augusto Morales Hernández, en adelante el DESARROLLADOR.
                            <br></br><br></br>
                            Mediante el presente contrato el usuario, administrador, o gestor, quien hace uso, administración o gestión de las herramientas mencionadas, en adelante el CLIENTE; acepta los términos y condiciones de uso, que se regirán por los siguientes puntos:
                            <br></br><br></br>
                            <strong style={{ fontWeight: 'bold', fontSize: '1.1em' }}>Primero.</strong> El desarrollador suministrará el diseño, la estructura, el código y el despliegue,  para poner en funcionamiento una aplicación web (página web), que tendrá por objeto la divulgación y promoción de productos y/o servicios, esta contendrá en términos generales, lo siguiente:
                            <br></br>
                            - Un panel de navegación.
                           <br></br>
                            - Un carrusel de imágenes dinámicas, AGREGADAS POR EL CLIENTE (esta funcionalidad tiene por objeto resaltar productos, promociones u ofertas).
                            <br></br>
                            - Una interfaz para clasificación de productos por categorías.
                            <br></br>
                           - Una interfaz para visualizar un listado de productos, AGREGADOS POR EL CLIENTE.
                            <br></br>
                            - Un buscador de productos.
                            <br></br>
                            - Un listado con el resumen de los productos por categorías.
                            <br></br>
                            - Un botón para acceso directo a Facebook y otro botón para acceso directo a WhatsApp.
                            <br></br>
                            - Una interfaz para la visualización de detalles de un producto, donde se muestran imágenes, título, descripción, cantidad y precio.
                            <br></br>
                            - Una interfaz para la gestión de cuentas de usuarios, estos podrán registrarse, iniciar sesión, modificar sus datos y cerrar sesión.
                            <br></br>
                           -  Una Interfaz carrito de compras, los usuarios podrán agregar y eliminar productos de un carrito de compras.
                           <br></br>
                            - Una Interfaz de confirmación de compra, los usuarios podrán confirmar su compra al visualizar los datos del usuario de quien realiza la compra, la lista de productos seleccionados y el medio de pago. (LA PLANTILLA BÁSICA NO INCLUYE PASARELA DE PAGOS CON ENTIDADES BANCARIAS).
                            <br></br>
                            - Una Interfaz lista de compras, los usuarios podrán visualizar la última compra realizada y un listado de compras realizadas anteriormente.
                            <br></br>
                            - Una interfaz de contacto donde se podrá visualizar datos del Cliente, como dirección del comercio, teléfonos de contacto, redes sociales y logo de copyright del autor del software con acceso directo a página web externa.
                            <br></br><br></br>
                            <strong style={{ fontWeight: 'bold', fontSize: '1.1em' }}>Parágrafo uno:</strong> el listado mencionado es propiedad intelectual exclusiva del desarrollador, y será facilitada a modo de licencia de software al cliente. El costo de la licencia de la aplicación web es de cero ($0) pesos mensuales.
                            <br></br><br></br>
                            <strong style={{ fontWeight: 'bold', fontSize: '1.1em' }}>Parágrafo dos:</strong> el desarrollador y el cliente podrán llegar a acuerdos para el desarrollo de funcionalidades extras de la aplicación web, cuyos términos y costos no están estipulados en este contrato. Así como la posible compra de la aplicación web por parte del cliente al desarrollador.
                            <br></br><br></br>
                            <strong style={{ fontWeight: 'bold', fontSize: '1.1em' }}>Parágrafo tres:</strong> en caso de mutuo acuerdo entre el desarrollador y el cliente de finalizar el presente contrato, el software volverá a la posesión del desarrollador, a excepción de los posibles acuerdos llegados en el parágrafo anterior.
                            <br></br><br></br>
                            <strong style={{ fontWeight: 'bold', fontSize: '1.1em' }}>Segundo.</strong> El desarrollador suministrará el diseño, la estructura, el código y el despliegue,  para poner en funcionamiento una aplicación web para la gestión de categorías de productos, productos, imagenes, compras, clientes, gastos y proveedores, que a su vez, será la fuente de datos y material multimedia de la cual se alimentará la página web inicial,  esta contendrá:
                            <br></br>
                            - Una interfaz para iniciar sesión y cerrar sesión mediante uso de usuario y contraseña.
                            <br></br>
                            - Una interfaz para la administración de productos, donde se podrá visualizar el listado de productos AGREGADOS POR EL CLIENTE, el cliente podrá buscar, agregar, modificar y eliminar productos.
                            <br></br>
                            - Una interfaz para la administración de categorías AGREGADAS POR EL CLIENTE, el cliente podrá buscar, agregar y eliminar categorías.
                            <br></br>
                            - Una interfaz para la administración de usuarios (un usuario es una persona que usa la aplicación web y potencial comprador de los productos), el cliente podrá buscar, agregar, modificar y eliminar los datos de los usuarios registrados.
                            <br></br>
                            - Una interfaz para la administración de imágenes dinámicas, el cliente podrá agregar, visualizar y eliminar imágenes dinámicas.
                            <br></br>
                            - Una interfaz para la administración de compras, el cliente podrá buscar, agregar y eliminar las compras realizadas tanto por los usuarios como por el mismo cliente.
                            <br></br><br></br>
                            <strong style={{ fontWeight: 'bold', fontSize: '1.1em' }}>Parágrafo uno:</strong> el listado mencionado anteriormente es propiedad intelectual exclusiva del desarrollador, y será facilitada a modo de licencia de software al cliente. El costo de licencia de la aplicación web es de cero ($0) pesos mensuales.
                            <br></br><br></br>
                            <strong style={{ fontWeight: 'bold', fontSize: '1.1em' }}>Parágrafo dos:</strong> el desarrollador y el cliente podrán llegar a acuerdos para el desarrollo de funcionalidades extras de la aplicación web, cuyos términos y costos no están estipulados en este contrato. Así como la posible compra de la aplicación web por parte del cliente al desarrollador.
                            <br></br><br></br>
                            <strong style={{ fontWeight: 'bold', fontSize: '1.1em' }}>Parágrafo tres:</strong> en caso de mutuo acuerdo entre desarrollador y cliente de finalizar el presente contrato de servicios, el software volverá a la posesión del desarrollador, a excepción de los posibles acuerdos llegados en el parágrafo anterior.
                            <br></br><br></br>
                            <strong style={{ fontWeight: 'bold', fontSize: '1.1em' }}>Tercero.</strong> Para la correcta funcionalidad de la aplicación web, el desarrollador contrata los servicios de hosting (alojamiento web), actualmente con la empresa hostinger, y en lo cual el desarrollador tendrá libertad de acción y elección de proveedor. El cliente se compromete a cancelar el valor veintiséis mil ($26.000) pesos mensuales, los cuales serán cancelados al desarrollador en la misma fecha de inicio de uso de los servicios.
                            <br></br><br></br>
                            <strong style={{ fontWeight: 'bold', fontSize: '1.1em' }}>Parágrafo uno:</strong> el valor mensual por concepto de hosting será ajustado anualmente aplicando el IPC anunciado por el gobierno nacional del año inmediatamente anterior. O según las condiciones de mercado las cuales considere el desarrollador, esto debidamente soportado.
                            <br></br><br></br>
                            <strong style={{ fontWeight: 'bold', fontSize: '1.1em' }}>Parágrafo dos:</strong> el valor mensual del hosting aplica para un ancho de banda máximo de 5000 Megabytes mensuales, y una capacidad de almacenamiento máxima de 10 Gigabytes. Estos datos se podrán extraer de los análisis realizados por google analytics, y/o de las estadísticas suministradas por el proveedor de hosting. En caso de incrementarse estos valores, el desarrollador y el cliente deberán llegar a  un nuevo acuerdo sobre las características del servicio de alojamiento web.
                            <br></br><br></br>
                            <strong style={{ fontWeight: 'bold', fontSize: '1.1em' }}>Cuarto.</strong> El material gráfico publicado en la aplicación web será aportado por el cliente, esto incluye el nombre, la descripción, referencias, precios, imágenes de los productos, entre otros. Así como logos, eslóganes, y otras imágenes publicitarias. El desarrollador no se hace responsable por la autoría, originalidad y derechos de autor de estos contenidos.
                            <br></br><br></br>
                            <strong style={{ fontWeight: 'bold', fontSize: '1.1em' }}>Quinto:</strong> el cliente podrá elegir y comprar un dominio para la aplicación web, el cliente deberá cancelar este valor directamente al proveedor de dominios o mediante gestión del mismo desarrollador.
                            <br></br><br></br>
                            <strong style={{ fontWeight: 'bold', fontSize: '1.1em' }}>Sexto: </strong>el cliente podrá adquirir un certificado SSL (Secure Sockets Layer) tanto para la aplicación web como para la aplicación de gestión, los costos relacionados con este rubro serán asumidos enteramente por el cliente.
                            <br></br><br></br>
                            <strong style={{ fontWeight: 'bold', fontSize: '1.1em' }}>Séptimo:</strong> el presente contrato no extiende ninguna obligación de carácter laboral a cargo del cliente y a favor del desarrollador, así como el desarrollador no tendrá ninguna responsabilidad ni obligación de prestación de servicios con el cliente.
                            <br></br><br></br>
                            <strong style={{ fontWeight: 'bold', fontSize: '1.1em' }}>Parágrafo uno:</strong> el presente contrato no incluye las tareas de mantenimiento y/o actualizaciones a las aplicaciones web, por tanto el cliente deberá cancelar el valor correspondiente por estos trabajos al desarrollador.
                            <br></br><br></br>
                            <strong style={{ fontWeight: 'bold', fontSize: '1.1em' }}>Octavo:</strong> el cliente no podrá ceder, comercializar, alquilar, o realizar otra actividad similar que represente beneficio económico, con las herramientas suministradas por el desarrollador, sin que se haya llegado a un acuerdo de compra total de estas aplicaciones.
                            <br></br><br></br>
                            <strong style={{ fontWeight: 'bold', fontSize: '1.1em' }}>Noveno:</strong> la información almacenada en las aplicaciones web, será resguardada y protegida por el proveedor de servicio de hosting, el cual ya se compromete en su contrato de prestación de servicios con el desarrollador a dicha actividad. Por tanto, el desarrollador se exime de la responsabilidad de salvaguardar dicha información de ataques informáticos y actividades similares. A su vez, el desarrollador se compromete a mantener en estricta reserva y confidencialidad la información mencionada, prohibiendo totalmente su divulgación y/o comunicación a terceros.
                            <br></br><br></br>
                            <strong style={{ fontWeight: 'bold', fontSize: '1.1em' }}>Décimo:</strong> el cliente será responsable y se compromete a cumplir con lo establecido en las leyes de protección de datos con la información suministrada por sus clientes. El desarrollador no tendrá ninguna responsabilidad en caso de que el cliente incurra en algún incumplimiento respecto a estos menesteres.
                            <br></br><br></br>

                        </p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" onClick={params.aceptarContrato} className="btn btn-outline-dark" data-dismiss="modal">Aceptar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DialogoContrato