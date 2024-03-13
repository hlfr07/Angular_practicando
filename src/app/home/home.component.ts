import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  parametro = '';

  constructor(private route: ActivatedRoute){
    this.route.params.subscribe(params =>{
      this.parametro = params['id'];
    });
  }

}
