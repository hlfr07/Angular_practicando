import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent {
  //para resivir el username, se declara asi porque hacemos referencia que es un string
  @Input() username = '';
  //se declara para enviar iformacion al padre, se tiene que indicar que tipo de variable le vamos a pasar
  @Output() addFavoriteEvent = new EventEmitter<string>();

//creamos un metodo para output
fav(gameName: string){
this.addFavoriteEvent.emit(gameName);
}
  games = [
    {
      id: 1,
      name: 'goku',
    },
    {
      id: 2,
      name: 'gta',
    },
    {
      id: 3,
      name: 'pes2021',
    },
  ];
}
