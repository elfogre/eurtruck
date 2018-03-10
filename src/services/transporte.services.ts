import { Injectable } from '@angular/core';
import { FirebaseListObservable, AngularFireDatabase,
  FirebaseObjectObservable  } from 'angularfire2/database';
import { Observable, Subscriber } from 'rxjs';
import { Transporte } from '../app/transporte';
import { Publicacion } from '../app/publicacion';
import { PujaService } from '../services/puja.services';


@Injectable()
export class TransporteService{

  viajes: FirebaseListObservable<any>;

  constructor(public database: AngularFireDatabase, public pujaService: PujaService) {
    this.viajes=this.database.list('/viajes',{
       query:{
         orderByChild: 'fechaOrden'
       }
     })
  }

  public getViajes() :FirebaseListObservable<any>{

    return this.viajes;
  }

public getViajesDisponibles() : Observable<any>{
   let viajesFiltrados = [];
   this.viajes.subscribe(viajes => {
       viajes.forEach(viaje => {
         if(viaje.idTransportista==''){
           viajesFiltrados.push(viaje);
        }
       });
     });
     return Observable.of(viajesFiltrados);
}


public getViaje(id): FirebaseObjectObservable<any>{
    //console.log('buscando viaje: ' + id);
    return this.database.object('viajes/' + id);
  //  this.viaje.subscribe(console.log);

}

updateViaje(viaje){
     this.viajes.update( viaje.$key,{
       destino: viaje.destino,
       done: !viaje.done
     });
}

 asignaViaje(idViaje, idUsuario){
   console.log('actualizando el viaje ' +idViaje + ', transportista ' + idUsuario);
   this.viajes.update(idViaje,{
     idTransportista: idUsuario
   });
 }

 public getOfertasPublicadas(id):  Publicacion[] {
   console.log('buscando ofertas para el user ' + id);
   let viajesFiltrados=[];
   this.viajes.subscribe(viajes => {
       viajes.forEach(viaje => {
         if(viaje.userId==id){
           let publicacion = new Publicacion();
           let transporte = new Transporte();
           transporte.carga = viaje.carga;
           transporte.codigoLavado = viaje.codigoLavado;
           transporte.destino = viaje.destino;
           transporte.especificaciones = viaje.especificaciones;
           transporte.fechaCarga = viaje.fechaCarga;
           transporte.fechaCreacion = viaje.fechaCreacion;
           transporte.fechaDescarga = viaje.fechaDescarga;
           transporte.fechaOrden = viaje.fechaOrden;
           transporte.idTransporte = viaje.$key;
           transporte.idTransportista = viaje.idTransportista;
           transporte.mercancia = viaje.mercancia;
           transporte.observaciones = viaje.observaciones;
           transporte.origen = viaje.origen;

           publicacion.transporte=transporte;
           publicacion.pujas = this.pujaService.getPujasDeViaje(viaje.$key);

           viajesFiltrados.push(publicacion);
           //viajesFiltrados.push(viaje);
         }
       });
     });
   return  viajesFiltrados;
}

 public getOfertasAsignadas(id) : Observable<any[]>{
   console.log('buscando ofertas asignadas para el user ' + id);
   let viajesFiltrados=[];
   this.viajes.subscribe(viajes => {
       viajes.forEach(viaje => {
         if(viaje.idTransportista==id){
           viajesFiltrados.push(viaje);
         }
       });
     });
   return  Observable.of(viajesFiltrados);
}

 removeViaje( viaje ){
   this.viajes.remove(viaje);
 }

}
