const fs = require('fs');
const axios = require('axios');

class Busquedas {

    historial = [];
    dbPath = './db/database.json';

    get paramsMapBox(){
        return {
            'access_token': process.env.MAPBOX_KEY,
            'autocomplete': true,
            'limit': 5,
            'language': 'es'
        }
    }

    constructor(){
        // TODO: leer db si existe
        this.leerDb();
    }

    async ciudad( lugar =  '' ){
        // Petición del lugar
        try{

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapBox
            })
            
            const { data } = await instance.get();

            return data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                longitud: lugar.center[0],
                latitud: lugar.center[1]
            }));
        }catch(error){
            return [];
        }

    }

    async climaLugar(latitud = '', longitud = ''){
        try{

            const instancia = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: {
                    lang: 'es',
                    units: 'metric',
                    appid: process.env.OPENWEATHER_KEY,
                    lat: latitud,
                    lon: longitud
                }
            }); 

            const { data } = await instancia.get();
            const { weather, main } = data;

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
            
        }catch(error){
            console.log(error);
        }
    }

    agregarHistorial( lugar = '' ){
        
        // Validando si existe el lugar
        const existeLugar = this.historial.find(l => l === lugar);
        
        if(!existeLugar){
            this.historial.unshift(lugar);
        }

        this.historial = this.historial.splice(0,5);

        this.guardarDb();
    }

    guardarDb(){

        const payload = {
            historia: this.historial
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerDb(){
        if( !fs.existsSync(this.dbPath)) return null;


        const { historia } = JSON.parse( fs.readFileSync(this.dbPath, {encoding: 'utf-8'}) ); 
        this.historial = historia;
    }

}


module.exports = Busquedas;