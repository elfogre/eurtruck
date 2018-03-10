import { Injectable } from '@angular/core';
import { FirebaseListObservable, AngularFireDatabase,
  FirebaseObjectObservable  } from 'angularfire2/database';
import { UserService } from '../services/user.services';
import { Observable, Subscriber } from 'rxjs';
import { Puja } from '../app/puja';

@Injectable()
export class PujaService{

  ofertas: FirebaseListObservable<any>;

  constructor(public database: AngularFireDatabase,   public userService: UserService) {
    this.ofertas=this.database.list('/ofertas');
  }

  public getTotalOfertas(){
    return this.ofertas;
  }

   public getOfertas(idUser){
     let pujasObservable = new Observable<Puja[]>();
     let pujas=[];

     this.ofertas= this.database.list('/ofertas',{
       query:{
         orderByChild: 'idUsuario',
         equalTo: idUser
       }
     });

     let usuarioOferta = this.userService.getUserProfileById(idUser);
     this.ofertas.subscribe(items => {
         items.forEach(item => {
         let puja = new Puja();
         puja.resumen= item.resumen;
         puja.importe = item.importe;
         puja.idViaje = item.idViaje;
         puja.idUsuario = item.idUsuario;
         usuarioOferta.subscribe(usu => {
           puja.email=usu.email ;
           puja.nombre= usu.contactName;
           puja.empresa= usu.empresa;
           puja.foto= usu.picture;
         });
         pujas.push(puja);
       });
     });
    return  pujasObservable =  Observable.of(pujas);
  }

  public getPujasDeViaje(idViaje) : FirebaseListObservable<any>{
    return this.database.list('/ofertas',{
      query:{
        orderByChild: 'idViaje',
        equalTo: idViaje
      }
    })
  }

  public getOfertasByViaje(idViaje): Observable<Puja[]>{
    let pujasObservable = new Observable<Puja[]>();
    let pujas=[];

    this.ofertas= this.database.list('/ofertas',{
      query:{
        orderByChild: 'idViaje',
        equalTo: idViaje
      }
    });

    this.ofertas.subscribe(items => {
       console.log('* pujas ' + items.length);

        items.forEach(item => {
        let usuarioOferta = this.userService.getUserProfileById(item.idUsuario);
        let puja = new Puja();

        puja.resumen= item.resumen;
        puja.importe = item.importe;
        puja.idViaje = item.idViaje;
        puja.idUsuario = item.idUsuario;
        puja.anulada = item.anulada;
        usuarioOferta.subscribe(usu => {
          puja.email=usu.email ;
          puja.nombre= usu.contactName;
          puja.empresa= usu.empresa;
          puja.foto= usu.picture;
        });

        pujas.push(puja);

      });
    });
    return  pujasObservable =  Observable.of(pujas);
 }

 public anulaPujas(idViaje){
  const pujas= this.database.list('/ofertas',{
     query:{
       orderByChild: 'idViaje',
       equalTo: idViaje
     }
   });
   pujas.subscribe(items => {
     items.forEach(item => {
         pujas.update(item, { anulada: true });
     })

   });
 }


 public guardaPuja(puja : Puja){

   this.ofertas.push(puja);

 }

}
