const inquirer = require('inquirer');
require('colors');

const leerInput = async(mensaje) => {
    const pregunta = [
        {
            type: 'input',
            name: 'lugar',
            message: mensaje,
            validate( value ){
                if( value.length === 0 ){
                    return 'Por favor, ingrese un valor'
                }

                return true;
            }
        }
    ]

    const { lugar } = await inquirer.prompt(pregunta);
    return lugar;
}

const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [
            {
                value: 1,
                name: `${ '1.' .green } Buscar ciudad`
            },
            {
                value: 2,
                name: `${ '2.' .green } Historial`
            },
            {
                value: 0,
                name: `${ '0.' .green } Salir`
            }
        ]
    }
]

const inquirerMenu = async () =>{
    console.clear();
    console.log('=============================' .green);
    console.log('    Seleccione una opción    ' .white);
    console.log('=============================' .green);

    const { opcion } = await inquirer.prompt(preguntas);

    return opcion;

}

const pausa = async () => {
    const pregunta = [
        {
            type: 'input',
            name: 'enter',
            message: `\nPresione ${ 'ENTER' .green } para continuar`
        }
    ]

    console.log(`\n`);
    await inquirer.prompt(pregunta);
}

const listarLugares = async ( lugares = [] ) => {
    const choices = lugares.map( (lugar, index) => {
        const idx = String(index + 1).green;
        return {
            value: lugar.id,
            name: `${ idx } ${lugar.nombre}`
        }

    });

    choices.unshift({
        value: 0,
        name: '0. Cancelar' .red
    })

    const pregunta = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar',
            choices
        }
    ]

    const { id } = await inquirer.prompt(pregunta);
    return id;
}

module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares
}
