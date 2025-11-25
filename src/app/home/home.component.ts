import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserComponent } from '../user/user.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [UserComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  title = 'practicando-angular';
  parametro = '';

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.parametro = params['id'];
    });
  }

}
