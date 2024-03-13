import { Component } from '@angular/core';
import { GameComponent } from '../game/game.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [GameComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
username= "luis07";
estadologin=false;

gavgame = "";

getfavorite(gameName: string){
  this.gavgame=gameName;
}

funtionalert(){
  alert("HOLA VIEJOOOO!!")
}
}
