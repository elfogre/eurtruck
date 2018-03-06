import { Transporte } from './transporte';
import { FirebaseListObservable, AngularFireDatabase,
  FirebaseObjectObservable  } from 'angularfire2/database';

export class Publicacion{
  transporte : Transporte;
  pujas : FirebaseListObservable<any>;

}
