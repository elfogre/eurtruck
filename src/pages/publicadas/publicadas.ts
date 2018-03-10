import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, ActionSheetController } from 'ionic-angular';
import { FirebaseListObservable, AngularFireDatabase, FirebaseObjectObservable  } from 'angularfire2/database';
import { DetallePage } from '../detalle/detalle';
import { NuevoViajePage } from '../nuevoViaje/nuevoViaje';
import { OfertadasPage } from '../ofertadas/ofertadas';
import { UserService } from '../../services/user.services';
import { TransporteService } from '../../services/transporte.services';
import { PujaService } from '../../services/puja.services';
import { Observable, Subscriber } from 'rxjs';
import { Transporte } from '../../app/transporte';
import { Publicacion } from '../../app/publicacion';

@Component({
  selector: 'page-publicadas',
  templateUrl: 'publicadas.html',
})
export class PublicadasPage {
  viajes: Publicacion[];
  userProfile:any;
  localUser:any;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public userService: UserService,
    public transporteService: TransporteService,
    public pujaService: PujaService,
    public database: AngularFireDatabase,
    public actionSheetCtrl: ActionSheetController
  ){
    this.localUser = userService.getLocalUser();
    this.userProfile = userService.getUserProfile();
    this.viajes = transporteService.getOfertasPublicadas(this.localUser.uid);
  }

  presentActionSheet(viaje) {
   let actionSheet = this.actionSheetCtrl.create({
     title: 'Acciones',
     buttons: [
       {
         text: 'Editar',
         handler: () => {
           this.navCtrl.push(NuevoViajePage, {idViaje:viaje.idTransporte});
         }
       },
       {
         text: 'Detalle',
         handler: () => {
           this.navCtrl.push(DetallePage, {idViaje:viaje.idTransporte});
         }
       },{
         text: 'Pujas',
         handler: () => {
          this.navCtrl.push(OfertadasPage, {idViaje:viaje.idTransporte});
         }
       },{
         text: 'Anular',
         handler: () => {
           this.borrar(viaje.idTransporte);
         }
       }
     ]
   });
   actionSheet.present();
 }


 borrar(idTransporte){
   let newTaskModal = this.alertCtrl.create({
   title: 'Anular el transporte?',
     buttons: [
       {
         text: 'Cancel',
         handler: data => {
           console.log('Cancel clicked');
         }
       },
       {
         text: 'Aceptar',
          handler: data => {
            let viaje = this.transporteService.getViaje(idTransporte);
            this.transporteService.removeViaje(viaje);
            this.pujaService.anulaPujas(idTransporte);
            this.navCtrl.setRoot(PublicadasPage);
         }
       }
     ]
   });
   newTaskModal.present( newTaskModal );
 }

}
