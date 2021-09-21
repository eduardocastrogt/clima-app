require('dotenv').config();

const { inquirerMenu, pausa, leerInput, listarLugares} = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

const main = async () => {

    let opt = 1;
    const busqueda = new Busquedas;
    busqueda.leerDb();

    // Impresión del menú
    do {
        opt = await inquirerMenu();

        switch(opt){
            case 1:
                // Mostrar mensaje
                const termino = await leerInput('Ciudad: ');
                
                //Buscar los lugares
                const lugares = await busqueda.ciudad( termino );
                
                //Seleccionar el lugar
                const id = await listarLugares(lugares);
                if(id === 0) continue;
                const lugarSeleccionado = lugares.find(lugar => lugar.id === id);

                //Guardar en db
                busqueda.agregarHistorial(lugarSeleccionado.nombre);
                
                //Clima
                const clima = await busqueda.climaLugar(lugarSeleccionado.latitud, lugarSeleccionado.longitud);

                //Mostrar resultados
                console.clear();
                console.log('\nInformación de la ciudad\n' .green);
                console.log('Ciudad: ', lugarSeleccionado.nombre);
                console.log('Latitud: ', lugarSeleccionado.latitud);
                console.log('Longitud: ', lugarSeleccionado.longitud);
                console.log('Temperatura: ', clima.temp);
                console.log('Minima: ', clima.min);
                console.log('Maxima: ', clima.max);
                console.log('Como esta el clima: ', clima.desc);
                break;
            case 2:
                console.log('');
                busqueda.historial.forEach( (lugar, index) => {
                    console.log(`${String(index + 1).green}. ${lugar}`);
                });
                break;
        }

        opt > 0 ? await pausa() : console.log('Saliendo');
        

    } while( opt > 0);

}

main();