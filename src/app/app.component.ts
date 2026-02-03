import { Component } from '@angular/core';
import { ValentineCardComponent } from './components/valentine-card/valentine-card.component';

@Component({
  selector: 'app-root',
  imports: [ValentineCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
})
export class AppComponent {
  title = 'my-app';
}
